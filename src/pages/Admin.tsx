
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Filter, Users, TrendingUp, Target, Calendar } from 'lucide-react';
import { LeadsList } from '@/components/admin/LeadsList';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { AssessmentManager } from '@/components/admin/AssessmentManager';
import ContentManager from '@/components/admin/ContentManager';
import { leadStorageService } from '@/services/leadStorage';

const Admin = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAudience, setFilterAudience] = useState('all');
  const [filterScore, setFilterScore] = useState('all');

  // Load real lead data from localStorage and refresh regularly
  useEffect(() => {
    const loadLeads = () => {
      try {
        const storedLeads = leadStorageService.getLeads();
        console.log('Loading leads from storage:', storedLeads);
        
        // Transform stored leads to match the expected format
        const transformedLeads = storedLeads.map(lead => ({
          id: parseInt(lead.id),
          firstName: lead.leadData.firstName,
          lastName: lead.leadData.lastName,
          email: lead.leadData.email,
          phone: lead.leadData.phone || '',
          ageRange: lead.leadData.ageRange,
          audience: lead.leadData.audience || 'individual',
          assessmentTitle: lead.assessmentTitle,
          overallScore: lead.overallScore,
          categoryScores: lead.categoryScores,
          completionDate: lead.completedAt.split('T')[0], // Format date
          source: lead.source || 'direct',
          completionRate: lead.completionRate || 100,
          tags: ['completed'] // Add default tags
        }));

        console.log('Transformed leads:', transformedLeads);
        setLeads(transformedLeads);
      } catch (error) {
        console.error('Error loading leads:', error);
        setLeads([]);
      }
    };

    loadLeads();

    // Refresh leads every 5 seconds to pick up new completions
    const interval = setInterval(loadLeads, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleViewLead = (leadId: number) => {
    console.log('Viewing lead:', leadId);
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      alert(`Lead Details:\n\nName: ${lead.firstName} ${lead.lastName}\nEmail: ${lead.email}\nScore: ${lead.overallScore}\nAssessment: ${lead.assessmentTitle}`);
    }
  };

  const handleEmailLead = (leadId: number) => {
    console.log('Emailing lead:', leadId);
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      // Open email client with pre-filled email
      const subject = encodeURIComponent('Your VoiceCard Assessment Results');
      const body = encodeURIComponent(`Hello ${lead.firstName},\n\nThank you for completing your VoiceCard assessment. We'd love to discuss your results further.\n\nBest regards,\nThe VoiceCard Team`);
      window.open(`mailto:${lead.email}?subject=${subject}&body=${body}`);
    }
  };

  const handleTagLead = (leadId: number) => {
    console.log('Tagging lead:', leadId);
    const tag = prompt('Enter tag for this lead:');
    if (tag) {
      // Update lead with new tag (this would typically be saved to a database)
      alert(`Tag "${tag}" added to lead ${leadId}`);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAudience = filterAudience === 'all' || lead.audience === filterAudience;
    
    const matchesScore = filterScore === 'all' || 
      (filterScore === 'high' && lead.overallScore >= 80) ||
      (filterScore === 'medium' && lead.overallScore >= 60 && lead.overallScore < 80) ||
      (filterScore === 'low' && lead.overallScore < 60);
    
    return matchesSearch && matchesAudience && matchesScore;
  });

  const stats = {
    totalLeads: leads.length,
    avgScore: leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.overallScore, 0) / leads.length) : 0,
    highQualityLeads: leads.filter(lead => lead.overallScore >= 80).length,
    completionRate: leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + (lead.completionRate || 100), 0) / leads.length) : 0
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      alert('No leads to export');
      return;
    }

    const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Age Range', 'Audience', 'Assessment', 'Overall Score', 'Readiness', 'Confidence', 'Clarity', 'Completion Date', 'Source', 'Tags'];
    
    const csvContent = [
      headers.join(','),
      ...filteredLeads.map(lead => [
        lead.firstName,
        lead.lastName,
        lead.email,
        lead.phone || '',
        lead.ageRange,
        lead.audience,
        lead.assessmentTitle,
        lead.overallScore,
        lead.categoryScores.readiness,
        lead.categoryScores.confidence,
        lead.categoryScores.clarity,
        lead.completionDate,
        lead.source,
        lead.tags.join('; ')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voicecard-leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearTestData = () => {
    if (confirm('Are you sure you want to clear all lead data? This action cannot be undone.')) {
      leadStorageService.clearLeads();
      setLeads([]);
      alert('Test data cleared successfully');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">VoiceCard Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Lead intelligence and assessment management</p>
            </div>
            <Button onClick={clearTestData} variant="outline" size="sm">
              Clear Test Data
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold">{stats.totalLeads}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold">{stats.avgScore}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">High Quality</p>
                <p className="text-2xl font-bold">{stats.highQualityLeads}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="leads" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads">Lead Intelligence</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="assessments">Assessment Manager</TabsTrigger>
            <TabsTrigger value="content">Content Manager</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            {/* Filters and Search */}
            <Card className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search leads..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterAudience} onValueChange={setFilterAudience}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Audiences</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterScore} onValueChange={setFilterScore}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Score Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scores</SelectItem>
                      <SelectItem value="high">High (80+)</SelectItem>
                      <SelectItem value="medium">Medium (60-79)</SelectItem>
                      <SelectItem value="low">Low (&lt;60)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={exportToCSV} className="flex items-center" disabled={filteredLeads.length === 0}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredLeads.length} of {leads.length} leads
                  {leads.length === 0 && " (No assessment completions yet)"}
                </p>
              </div>
            </Card>

            {leads.length > 0 ? (
              <LeadsList 
                leads={filteredLeads} 
                onView={handleViewLead}
                onEmail={handleEmailLead}
                onTag={handleTagLead}
              />
            ) : (
              <Card className="p-8 text-center">
                <div className="text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Leads Yet</h3>
                  <p className="text-sm">Assessment completions will appear here automatically.</p>
                  <p className="text-xs mt-2">Share your assessment links to start collecting leads!</p>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard leads={leads} />
          </TabsContent>

          <TabsContent value="assessments">
            <AssessmentManager />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

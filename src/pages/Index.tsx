
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Copy, Trash2, Link, Users, BarChart3, Settings } from 'lucide-react';
import { assessmentTemplates } from '@/data/assessmentTemplates';
import { AssessmentTemplate } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';
import { AssessmentEditor } from '@/components/admin/AssessmentEditor';
import { LeadsList } from '@/components/admin/LeadsList';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { leadStorageService } from '@/services/leadStorage';

const Index = () => {
  const [templates, setTemplates] = useState(assessmentTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  // Get leads data for analytics
  const leads = leadStorageService.getLeads();

  const handleCreateNew = () => {
    const newTemplate: AssessmentTemplate = {
      id: Date.now(),
      title: 'New Assessment',
      description: 'New assessment description',
      audience: 'individual',
      tags: ['new'],
      questions: [],
      image: ''
    };
    setSelectedTemplate(newTemplate);
    setEditMode(true);
    toast({
      title: "New Template",
      description: "Creating new assessment template",
    });
  };

  const handleEditTemplate = (template: AssessmentTemplate) => {
    setSelectedTemplate({...template});
    setEditMode(true);
    toast({
      title: "Opening Editor",
      description: `Now editing "${template.title}"`,
    });
  };

  const handleSaveTemplate = (updatedTemplate: AssessmentTemplate) => {
    const existingIndex = templates.findIndex(t => t.id === updatedTemplate.id);
    if (existingIndex >= 0) {
      const updatedTemplates = [...templates];
      updatedTemplates[existingIndex] = updatedTemplate;
      setTemplates(updatedTemplates);
      toast({
        title: "Template Updated",
        description: `"${updatedTemplate.title}" has been saved successfully.`,
      });
    } else {
      setTemplates([...templates, updatedTemplate]);
      toast({
        title: "Template Created",
        description: `"${updatedTemplate.title}" has been created successfully.`,
      });
    }
    setEditMode(false);
    setSelectedTemplate(null);
  };

  const handleDuplicateTemplate = (template: AssessmentTemplate) => {
    const duplicated: AssessmentTemplate = {
      ...template,
      id: Date.now(),
      title: `${template.title} (Copy)`,
      tags: [...template.tags, 'duplicate']
    };
    setTemplates([...templates, duplicated]);
    toast({
      title: "Template Duplicated",
      description: `"${duplicated.title}" has been created.`,
    });
  };

  const handleDeleteTemplate = (templateId: number) => {
    const templateToDelete = templates.find(t => t.id === templateId);
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: `"${templateToDelete?.title}" has been deleted.`,
      variant: "destructive",
    });
  };

  const copyAssessmentLink = async (template: AssessmentTemplate) => {
    const url = `${window.location.origin}/assessment/${template.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Assessment Link Copied!",
        description: `Link copied: ${url}`,
      });
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Assessment Link Copied!",
        description: `Link copied: ${url}`,
      });
    }
  };

  if (editMode && selectedTemplate) {
    return (
      <AssessmentEditor
        template={selectedTemplate}
        onSave={handleSaveTemplate}
        onCancel={() => {
          setEditMode(false);
          setSelectedTemplate(null);
          toast({
            title: "Editor Closed",
            description: "Changes have been discarded.",
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to VoiceCard</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover your path through personalized voice-guided assessments
          </p>
        </div>

        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessments" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Assessments</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Leads</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assessments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Available Assessments</h3>
              <Button onClick={handleCreateNew} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  {template.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={template.image} 
                        alt={template.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{template.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-3">
                          <Badge variant={template.audience === 'business' ? 'default' : 'secondary'}>
                            {template.audience}
                          </Badge>
                          {template.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-4">
                          {template.questions.length} questions • Est. {Math.ceil(template.questions.length * 0.75)} min
                        </p>
                        
                        {/* Assessment Link */}
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
                          <p className="text-sm font-medium text-blue-900 mb-1">Public Link:</p>
                          <code className="text-xs bg-white px-2 py-1 rounded border block w-full text-gray-700 break-all">
                            {window.location.origin}/assessment/{template.id}
                          </code>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm"
                        onClick={() => copyAssessmentLink(template)}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                      >
                        <Link className="h-3 w-3" />
                        Copy URL
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDuplicateTemplate(template)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leads">
            <LeadsList />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard leads={leads} />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">VoiceCard Settings</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Voice Configuration</h4>
                  <p className="text-sm text-blue-800">
                    All assessments use a consistent, natural American female voice for the best user experience.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Public Access</h4>
                  <p className="text-sm text-green-800">
                    All assessment links are publicly accessible without login requirements.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

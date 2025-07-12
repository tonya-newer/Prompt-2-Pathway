
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Search, 
  Eye, 
  Mail, 
  Tag, 
  Download, 
  Filter,
  MoreHorizontal,
  Phone,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ageRange: string;
  assessment: string;
  score: number;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  completedAt: string;
  tags: string[];
}

interface LeadsListProps {
  leads?: any[];
  onView?: (leadId: number) => void;
  onEmail?: (leadId: number) => void;
  onTag?: (leadId: number) => void;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    ageRange: '35-44',
    assessment: 'Career Clarity',
    score: 85,
    status: 'qualified',
    completedAt: '2024-01-15',
    tags: ['high-priority', 'career-change']
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@email.com',
    ageRange: '25-34',
    assessment: 'Leadership Skills',
    score: 62,
    status: 'contacted',
    completedAt: '2024-02-01',
    tags: ['leadership', 'follow-up']
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@email.com',
    phone: '(555) 987-6543',
    ageRange: '45-54',
    assessment: 'Financial Planning',
    score: 92,
    status: 'converted',
    completedAt: '2024-02-10',
    tags: ['financial-planning', 'vip']
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@email.com',
    ageRange: '55+',
    assessment: 'Retirement Readiness',
    score: 48,
    status: 'new',
    completedAt: '2024-02-18',
    tags: ['retirement', 'urgent']
  },
  {
    id: '5',
    firstName: 'Jessica',
    lastName: 'Garcia',
    email: 'jessica.garcia@email.com',
    phone: '(555) 246-8013',
    ageRange: '25-34',
    assessment: 'Personal Development',
    score: 75,
    status: 'qualified',
    completedAt: '2024-02-25',
    tags: ['personal-growth']
  }
];

export const LeadsList = ({ leads: externalLeads, onView, onEmail, onTag }: LeadsListProps) => {
  const [leads, setLeads] = useState(externalLeads || mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { toast } = useToast();

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    console.log('Viewing lead details:', lead);
    
    // Use external handler if provided, otherwise use internal logic
    if (onView) {
      onView(parseInt(leadId));
    }
    
    toast({
      title: "Lead Details",
      description: `Viewing details for ${lead?.firstName} ${lead?.lastName}`,
    });
  };

  const handleEmailLead = async (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    try {
      // Use external handler if provided
      if (onEmail) {
        onEmail(parseInt(leadId));
      }
      
      // This would integrate with an email service
      console.log('Sending email to:', lead?.email);
      toast({
        title: "Email Sent",
        description: `Email sent to ${lead?.firstName} ${lead?.lastName}`,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      toast({
        title: "Email Failed",
        description: "Unable to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTagLead = (leadId: string, newTag: string) => {
    setLeads(leads.map(lead => 
      lead.id === leadId 
        ? { ...lead, tags: [...lead.tags, newTag] }
        : lead
    ));
    
    // Use external handler if provided
    if (onTag) {
      onTag(parseInt(leadId));
    }
    
    const lead = leads.find(l => l.id === leadId);
    toast({
      title: "Tag Added",
      description: `Added tag "${newTag}" to ${lead?.firstName} ${lead?.lastName}`,
    });
  };

  const exportLeads = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Assessment,Score,Status,Date\n" +
      filteredLeads.map(lead => 
        `"${lead.firstName} ${lead.lastName}","${lead.email}","${lead.phone}","${lead.assessment}","${lead.score}","${lead.status}","${lead.completedAt}"`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "voiceflow-leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export Complete",
      description: "Leads data has been exported to CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lead Intelligence</h3>
        <Button onClick={exportLeads} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.firstName} {lead.lastName}</div>
                      <div className="text-sm text-gray-500">{lead.ageRange}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{lead.email}</div>
                      {lead.phone && (
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lead.assessment}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={lead.score >= 80 ? 'default' : lead.score >= 60 ? 'secondary' : 'outline'}>
                      {lead.score}/100
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      lead.status === 'converted' ? 'default' :
                      lead.status === 'qualified' ? 'secondary' :
                      lead.status === 'contacted' ? 'outline' : 'outline'
                    }>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{lead.completedAt}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewLead(lead.id)}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEmailLead(lead.id)}
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTagLead(lead.id, 'follow-up')}
                        title="Add Tag"
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No leads found matching your criteria.</p>
          </div>
        )}
      </Card>
    </div>
  );
};

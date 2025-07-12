
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Mail, Tag, Phone } from 'lucide-react';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ageRange: string;
  audience: string;
  assessmentTitle: string;
  overallScore: number;
  categoryScores: {
    readiness: number;
    confidence: number;
    clarity: number;
  };
  completionDate: string;
  source: string;
  completionRate: number;
  tags: string[];
}

interface LeadsListProps {
  leads: Lead[];
  onView?: (leadId: number) => void;
  onEmail?: (leadId: number) => void;
  onTag?: (leadId: number) => void;
}

export const LeadsList = ({ leads, onView, onEmail, onTag }: LeadsListProps) => {
  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <p className="text-gray-600">{lead.email}</p>
                  {lead.phone && (
                    <p className="text-gray-600 flex items-center mt-1">
                      <Phone className="h-4 w-4 mr-1" />
                      {lead.phone}
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {lead.overallScore}%
                  </div>
                  <p className="text-sm text-gray-500">Overall Score</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Assessment</p>
                  <p className="font-medium text-sm">{lead.assessmentTitle}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Age Range</p>
                  <p className="font-medium text-sm">{lead.ageRange}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="font-medium text-sm">{lead.source}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Completion</p>
                  <p className="font-medium text-sm">{lead.completionRate}%</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={lead.audience === 'business' ? 'default' : 'secondary'}>
                    {lead.audience}
                  </Badge>
                  {lead.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onView?.(lead.id)}
                    title="View Lead Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEmail?.(lead.id)}
                    title="Send Email"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onTag?.(lead.id)}
                    title="Manage Tags"
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-sm font-medium text-blue-600">
                    {lead.categoryScores.readiness}%
                  </div>
                  <p className="text-xs text-gray-500">Readiness</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-green-600">
                    {lead.categoryScores.confidence}%
                  </div>
                  <p className="text-xs text-gray-500">Confidence</p>
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-purple-600">
                    {lead.categoryScores.clarity}%
                  </div>
                  <p className="text-xs text-gray-500">Clarity</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
      
      {leads.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No leads found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

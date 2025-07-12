
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Mail, Phone, Tag, Edit } from 'lucide-react';

interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
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
}

export const LeadsList = ({ leads }: LeadsListProps) => {
  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAudienceBadgeVariant = (audience: string) => {
    return audience === 'business' ? 'default' : 'secondary';
  };

  return (
    <div className="space-y-4">
      {leads.map((lead) => (
        <Card key={lead.id} className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Lead Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold">
                  {lead.firstName} {lead.lastName}
                </h3>
                <Badge variant={getAudienceBadgeVariant(lead.audience)}>
                  {lead.audience}
                </Badge>
                <Badge className={`${getScoreBadgeColor(lead.overallScore)} text-white`}>
                  {lead.overallScore}%
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1 mb-3">
                <div className="flex items-center space-x-4">
                  <span>{lead.email}</span>
                  {lead.phone && <span>{lead.phone}</span>}
                  <span>Age: {lead.ageRange}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>{lead.assessmentTitle}</span>
                  <span>•</span>
                  <span>{lead.completionDate}</span>
                  <span>•</span>
                  <span>Source: {lead.source}</span>
                </div>
              </div>

              {/* Category Scores */}
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Readiness</span>
                    <span className="text-xs font-medium">{lead.categoryScores.readiness}%</span>
                  </div>
                  <Progress value={lead.categoryScores.readiness} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Confidence</span>
                    <span className="text-xs font-medium">{lead.categoryScores.confidence}%</span>
                  </div>
                  <Progress value={lead.categoryScores.confidence} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500">Clarity</span>
                    <span className="text-xs font-medium">{lead.categoryScores.clarity}%</span>
                  </div>
                  <Progress value={lead.categoryScores.clarity} className="h-2" />
                </div>
              </div>

              {/* Tags */}
              {lead.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {lead.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-1" />
                Email
              </Button>
              <Button variant="outline" size="sm">
                <Tag className="h-4 w-4 mr-1" />
                Tag
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {leads.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-gray-500">No leads found matching your criteria.</p>
        </Card>
      )}
    </div>
  );
};

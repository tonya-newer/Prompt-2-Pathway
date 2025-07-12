
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Copy, Trash2, Mic, Settings } from 'lucide-react';
import { assessmentTemplates } from '@/data/assessmentTemplates';

export const AssessmentManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setEditMode(true);
  };

  const handleDuplicateTemplate = (template: any) => {
    const duplicated = {
      ...template,
      id: Date.now(),
      title: `${template.title} (Copy)`,
      tags: [...template.tags, 'duplicate']
    };
    console.log('Duplicating template:', duplicated);
  };

  return (
    <Tabs defaultValue="templates" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="templates">Template Library</TabsTrigger>
        <TabsTrigger value="create">Create New</TabsTrigger>
        <TabsTrigger value="voice">Voice Scripts</TabsTrigger>
      </TabsList>

      <TabsContent value="templates" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Assessment Templates</h3>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessmentTemplates.map((template) => (
            <Card key={template.id} className="p-6">
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
                  
                  <p className="text-xs text-gray-500">
                    {template.questions.length} questions • Est. {Math.ceil(template.questions.length * 0.75)} min
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleEditTemplate(template)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDuplicateTemplate(template)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="create" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Create New Assessment</h3>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Assessment Title</Label>
                <Input id="title" placeholder="e.g., Business Growth Readiness" />
              </div>
              <div>
                <Label htmlFor="audience">Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business Owner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Brief description of what this assessment measures..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" placeholder="growth, readiness, business" />
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-4">Questions</h4>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add First Question
              </Button>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline">Save as Draft</Button>
              <Button>Create Assessment</Button>
            </div>
          </div>
        </Card>
      </TabsContent>

      <TabsContent value="voice" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Mic className="h-5 w-5 mr-2" />
            Voice Script Management
          </h3>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="intro-script">Intro Voice Script</Label>
              <Textarea 
                id="intro-script"
                placeholder="Welcome to your VoiceFlow assessment. I'm here to guide you through..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="mid-script">Mid-Assessment Encouragement</Label>
              <Textarea 
                id="mid-script"
                placeholder="You're doing great! Let's continue with the next set of questions..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="outro-script">Outro Voice Script</Label>
              <Textarea 
                id="outro-script"
                placeholder="Congratulations on completing your assessment. Your results are ready..."
                rows={4}
              />
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Settings className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium text-blue-900">ElevenLabs Integration</span>
              </div>
              <p className="text-sm text-blue-800 mb-3">
                Connect your ElevenLabs API key to enable premium voice synthesis for all assessments.
              </p>
              <div className="space-y-3">
                <Input placeholder="Enter your ElevenLabs API key" type="password" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aria">Aria (Professional Female)</SelectItem>
                    <SelectItem value="roger">Roger (Confident Male)</SelectItem>
                    <SelectItem value="sarah">Sarah (Warm Female)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline">Test Voice</Button>
              <Button>Save Scripts</Button>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

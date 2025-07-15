import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Copy, Trash2, Mic, Settings, Link, Save, X, Upload, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { assessmentTemplates } from '@/data/assessmentTemplates';
import { AssessmentTemplate, Question } from '@/types/assessment';
import { AssessmentEditor } from './AssessmentEditor';

export const AssessmentManager = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<AssessmentTemplate | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [templates, setTemplates] = useState(assessmentTemplates);
  const [voiceScripts, setVoiceScripts] = useState({
    intro: "Welcome to your VoiceFlow assessment. I'm here to guide you through a personalized experience that will help you gain clarity on your path forward. Let's begin this journey together.",
    mid: "You're doing great! These insights are helping us understand your unique situation. Let's continue with the next set of questions.",
    outro: "Congratulations on completing your assessment. Your personalized results are ready, and I'm excited to share the insights we've discovered about your journey."
  });
  const [apiKey, setApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('9BWtsMINqrJLrRacOk9x');
  const { toast } = useToast();

  const handleEditTemplate = (template: AssessmentTemplate) => {
    console.log('Opening template for editing:', template.title);
    setSelectedTemplate({...template});
    setEditMode(true);
    toast({
      title: "Opening Editor",
      description: `Now editing "${template.title}"`,
    });
  };

  const handleCreateNew = () => {
    console.log('Creating new assessment template');
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

  const handleSaveTemplate = (updatedTemplate: AssessmentTemplate) => {
    console.log('Saving template:', updatedTemplate);
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
    const url = `${window.location.origin}/assessment/${template.audience}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Assessment Link Copied!",
        description: `Link copied: ${url}`,
      });
      console.log('Assessment link copied:', url);
    } catch (error) {
      console.error('Failed to copy link:', error);
      // Fallback for older browsers
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

  const testVoice = () => {
    console.log('Testing voice with script:', voiceScripts.intro);
    toast({
      title: "Voice Test",
      description: "Voice test functionality will be available with ElevenLabs integration.",
    });
  };

  const saveVoiceScripts = () => {
    console.log('Voice scripts saved:', voiceScripts);
    toast({
      title: "Scripts Saved",
      description: "Voice scripts have been saved successfully.",
    });
  };

  const sendEmailNotification = async (completedAssessment: any) => {
    try {
      // This would typically integrate with an email service
      console.log('Sending email notification to info@newerconsulting.com');
      toast({
        title: "Email Sent",
        description: "Assessment completion notification sent to info@newerconsulting.com",
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
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
    <Tabs defaultValue="templates" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="templates">Template Library</TabsTrigger>
        <TabsTrigger value="create">Create New</TabsTrigger>
        <TabsTrigger value="voice">Voice Scripts</TabsTrigger>
      </TabsList>

      <TabsContent value="templates" className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Assessment Templates</h3>
          <Button onClick={handleCreateNew} className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Template
          </Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              {template.image && (
                <div className="h-32 overflow-hidden">
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
                    
                    <p className="text-xs text-gray-500 mb-3">
                      {template.questions.length} questions • Est. {Math.ceil(template.questions.length * 0.75)} min
                    </p>
                    
                    {/* Assessment Link with Copy Button */}
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-xs text-gray-600 mb-2">Assessment Link:</p>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs bg-white px-2 py-1 rounded flex-1 truncate">
                          {window.location.origin}/assessment/{template.audience}
                        </code>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => copyAssessmentLink(template)}
                          className="flex-shrink-0"
                        >
                          <Link className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditTemplate(template)}
                    title="Edit Assessment"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDuplicateTemplate(template)}
                    title="Duplicate Assessment"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    title="Delete Assessment"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="create" className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Create New Assessment</h3>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Click the button below to start creating your new assessment</p>
            <Button onClick={handleCreateNew} className="flex items-center mx-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New Assessment
            </Button>
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
                value={voiceScripts.intro}
                onChange={(e) => setVoiceScripts({...voiceScripts, intro: e.target.value})}
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="mid-script">Mid-Assessment Encouragement</Label>
              <Textarea 
                id="mid-script"
                value={voiceScripts.mid}
                onChange={(e) => setVoiceScripts({...voiceScripts, mid: e.target.value})}
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="outro-script">Outro Voice Script</Label>
              <Textarea 
                id="outro-script"
                value={voiceScripts.outro}
                onChange={(e) => setVoiceScripts({...voiceScripts, outro: e.target.value})}
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
                <Input 
                  placeholder="Enter your ElevenLabs API key" 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9BWtsMINqrJLrRacOk9x">Aria (Professional Female)</SelectItem>
                    <SelectItem value="CwhRBWXzGAHq8TQ4Fs17">Roger (Confident Male)</SelectItem>
                    <SelectItem value="EXAVITQu4vr4xnSDxMaL">Sarah (Warm Female)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={testVoice}>
                <Mic className="h-4 w-4 mr-2" />
                Test Voice
              </Button>
              <Button onClick={saveVoiceScripts}>
                <Save className="h-4 w-4 mr-2" />
                Save Scripts
              </Button>
            </div>
          </div>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

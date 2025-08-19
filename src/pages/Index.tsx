
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, BarChart3, Settings, Mic } from 'lucide-react';
import { AssessmentTemplate } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AssessmentsList } from '@/components/admin/AssessmentsList';
import { LeadsList } from '@/components/admin/LeadsList';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { leadStorageService } from '@/services/leadStorage';
// import { assessmentStorageService } from '@/services/assessmentStorage';

const Index = () => {
  const [templates, setTemplates] = useState<AssessmentTemplate[]>([]);
  const [selectedTemplateForVoice, setSelectedTemplateForVoice] = useState<AssessmentTemplate | null>(null);
  const [voiceSettings, setVoiceSettings] = useState({
    welcomeMessage: "Welcome to this assessment. Let's begin your journey of discovery.",
    completionMessage: "Congratulations! You've completed the assessment. Your results are being calculated.",
    voiceTone: "warm and encouraging"
  });
  const { toast } = useToast();

  // Load templates from storage service
  // useEffect(() => {
  //   setTemplates(assessmentStorageService.getAllAssessments());
  // }, []);

  const leads = leadStorageService.getLeads();

  const handleSaveVoiceSettings = () => {
    toast({
      title: "Voice Settings Saved",
      description: "Voice scripts and settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Prompt 2 Pathway</h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover your path through personalized voice-guided assessments
          </p>
        </div>

        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="assessments" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Assessments</span>
            </TabsTrigger>
            <TabsTrigger value="voice-settings" className="flex items-center space-x-2">
              <Mic className="h-4 w-4" />
              <span>Voice Settings</span>
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
            <AssessmentsList />
          </TabsContent>

          {/* <TabsContent value="voice-settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Voice Scripts & Settings</h3>
              <Button onClick={handleSaveVoiceSettings} className="flex items-center">
                <Mic className="h-4 w-4 mr-2" />
                Save Voice Settings
              </Button>
            </div>

            <div className="grid gap-6">
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Select Assessment to Edit Voice Scripts</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplateForVoice?.id === template.id ? 'default' : 'outline'}
                      onClick={() => setSelectedTemplateForVoice(template)}
                      className="h-auto p-4 text-left flex flex-col items-start"
                    >
                      <span className="font-medium">{template.title}</span>
                      <span className="text-xs text-gray-500">{template.questions.length} questions</span>
                    </Button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Global Voice Settings</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="welcome-message">Welcome Message</Label>
                    <Textarea
                      id="welcome-message"
                      value={voiceSettings.welcomeMessage}
                      onChange={(e) => setVoiceSettings({...voiceSettings, welcomeMessage: e.target.value})}
                      placeholder="Enter the welcome message for all assessments..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="completion-message">Completion Message</Label>
                    <Textarea
                      id="completion-message"
                      value={voiceSettings.completionMessage}
                      onChange={(e) => setVoiceSettings({...voiceSettings, completionMessage: e.target.value})}
                      placeholder="Enter the completion message for all assessments..."
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="voice-tone">Voice Tone & Style</Label>
                    <Input
                      id="voice-tone"
                      value={voiceSettings.voiceTone}
                      onChange={(e) => setVoiceSettings({...voiceSettings, voiceTone: e.target.value})}
                      placeholder="e.g., warm and encouraging, professional, friendly"
                      className="mt-2"
                    />
                  </div>
                </div>
              </Card>

              {selectedTemplateForVoice && (
                <Card className="p-6">
                  <h4 className="text-lg font-semibold mb-4">
                    Voice Scripts for "{selectedTemplateForVoice.title}"
                  </h4>
                  <div className="space-y-6">
                    {selectedTemplateForVoice.questions.map((question, index) => (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Question {index + 1}</h5>
                          <Badge variant="outline">{question.type}</Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 mb-3">
                          <strong>Question:</strong> {question.question}
                        </div>
                        
                        <div>
                          <Label htmlFor={`voice-script-${question.id}`}>Voice Script</Label>
                          <Textarea
                            id={`voice-script-${question.id}`}
                            value={question.voiceScript || ''}
                            placeholder="Enter the voice script for this question..."
                            className="mt-2"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="text-lg font-semibold mb-4 text-blue-900">Voice Configuration</h4>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Mic className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Natural American Female Voice</span>
                    <Badge className="bg-green-100 text-green-800 border-green-300">Active</Badge>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    Using consistent, warm American female voice across all assessments for optimal user experience.
                  </p>
                  <div className="text-xs text-blue-600">
                    <strong>Voice Parameters:</strong> Rate: 0.9 | Pitch: 1.0 | Natural Tone
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent> */}

          <TabsContent value="leads">
            <LeadsList />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard leads={leads} />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Prompt 2 Pathway Settings</h3>
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


import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { AssessmentManager } from '@/components/admin/AssessmentManager';
import { LeadsList } from '@/components/admin/LeadsList';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import ContentManager from '@/components/admin/ContentManager';
import { Settings, Users, BarChart3, FileText, Key } from 'lucide-react';
import { getLeads } from '@/services/leadStorage';

const Admin = () => {
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('elevenlabs-api-key') || '';
  });
  const { toast } = useToast();

  // Get leads data for analytics
  const leads = getLeads();

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('elevenlabs-api-key', apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "ElevenLabs API key has been saved successfully.",
      });
    } else {
      localStorage.removeItem('elevenlabs-api-key');
      toast({
        title: "API Key Removed",
        description: "ElevenLabs API key has been removed.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VoiceCard Admin Dashboard</h1>
          <p className="text-gray-600">Manage your assessments, leads, and VoiceCard settings</p>
        </div>

        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="assessments" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
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

          <TabsContent value="assessments">
            <AssessmentManager />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsList />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard leads={leads} />
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid gap-6">
              {/* VoiceCard Settings */}
              <Card className="p-6">
                <div className="flex items-center mb-4">
                  <Key className="h-5 w-5 mr-2 text-blue-600" />
                  <h3 className="text-lg font-semibold">VoiceCard Settings</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="elevenlabs-key" className="text-sm font-medium">
                      ElevenLabs API Key
                    </Label>
                    <p className="text-xs text-gray-500 mb-2">
                      Enter your ElevenLabs API key to enable premium voice features across all VoiceCard assessments
                    </p>
                    <div className="flex space-x-2">
                      <Input
                        id="elevenlabs-key"
                        type="password"
                        placeholder="sk-..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleSaveApiKey}>
                        Save
                      </Button>
                    </div>
                    {apiKey && (
                      <p className="text-xs text-green-600 mt-1">
                        ✓ API key configured - Premium voice features enabled
                      </p>
                    )}
                  </div>
                </div>
              </Card>

              {/* Content Management */}
              <ContentManager />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

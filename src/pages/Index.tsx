import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BarChart3, Settings, Mic } from 'lucide-react';
import { AssessmentsList } from '@/components/admin/AssessmentsList';
import { LeadsList } from '@/components/admin/LeadsList';
import { VoiceSettings } from '@/components/admin/VoiceSettings';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

const Index = () => {
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

          <TabsContent value="voice-settings" className="space-y-6">
            <VoiceSettings />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsList />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
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

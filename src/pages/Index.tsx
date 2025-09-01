import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, BarChart3, Settings as SettingsIcon, Mic, LogOut } from 'lucide-react';
import { AssessmentsList } from '@/components/admin/AssessmentsList';
import { LeadsList } from '@/components/admin/LeadsList';
import { VoiceSettings } from '@/components/admin/VoiceSettings';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';
import { Settings } from '@/components/admin/Settings';

const Index = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // clear JWT
    navigate('/login'); // redirect to login
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Prompt 2 Pathway</h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover your path through personalized voice-guided assessments
            </p>
          </div>
          <Button onClick={handleLogout} className="flex items-center">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
				  </Button>
        </div>

        <Tabs defaultValue="assessments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="assessments" className="flex items-center space-x-2">
              <SettingsIcon className="h-4 w-4" />
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
              <SettingsIcon className="h-4 w-4" />
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
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

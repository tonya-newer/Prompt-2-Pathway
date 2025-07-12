import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, RotateCcw, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'button' | 'header';
}

const ContentManager = () => {
  const { toast } = useToast();
  
  // Default content sections
  const [homePageContent, setHomePageContent] = useState<ContentSection[]>([
    {
      id: 'hero-title',
      title: 'Hero Title',
      content: 'Welcome to VoiceFlow',
      type: 'header'
    },
    {
      id: 'hero-subtitle',
      title: 'Hero Subtitle',
      content: 'Experience voice-guided clarity assessments that reveal insights about your path forward',
      type: 'text'
    },
    {
      id: 'start-journey-btn',
      title: 'Start Journey Button',
      content: 'Start Your Journey',
      type: 'button'
    },
    {
      id: 'preview-voice-btn',
      title: 'Preview Voice Button',
      content: 'Preview Voice Experience',
      type: 'button'
    },
    {
      id: 'why-voiceflow-title',
      title: 'Why VoiceFlow Section Title',
      content: 'Why VoiceFlow?',
      type: 'header'
    },
    {
      id: 'why-voiceflow-subtitle',
      title: 'Why VoiceFlow Subtitle',
      content: 'Our voice-guided assessments provide deeper insights through human connection and personalized experiences',
      type: 'text'
    }
  ]);

  const [footerContent, setFooterContent] = useState<ContentSection[]>([
    {
      id: 'footer-title',
      title: 'Footer Title',
      content: 'VoiceFlow',
      type: 'header'
    },
    {
      id: 'footer-tagline',
      title: 'Footer Tagline',
      content: 'Empowering clarity through voice-guided assessments',
      type: 'text'
    }
  ]);

  const [resultsPageContent, setResultsPageContent] = useState<ContentSection[]>([
    {
      id: 'results-title',
      title: 'Results Page Title',
      content: 'Your VoiceFlow Clarity Snapshot',
      type: 'header'
    },
    {
      id: 'congratulations-message',
      title: 'Congratulations Message',
      content: 'CONGRATULATIONS! Assessment Complete - Your Results Are Ready!',
      type: 'text'
    },
    {
      id: 'ready-explore-title',
      title: 'Ready to Explore More Title',
      content: 'Ready to Explore More?',
      type: 'header'
    },
    {
      id: 'schedule-call-btn',
      title: 'Schedule Call Button',
      content: 'Schedule a Clarity Call',
      type: 'button'
    },
    {
      id: 'resources-btn',
      title: 'Resources Button',
      content: 'Access Additional Resources',
      type: 'button'
    }
  ]);

  const updateContent = (sections: ContentSection[], setSections: React.Dispatch<React.SetStateAction<ContentSection[]>>, id: string, newContent: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, content: newContent } : section
    ));
  };

  const saveContent = () => {
    // In a real implementation, this would save to a backend
    console.log('Saving content:', { homePageContent, footerContent, resultsPageContent });
    toast({
      title: "Content Saved",
      description: "All content changes have been saved successfully.",
    });
  };

  const resetToDefaults = () => {
    // Reset all content to defaults
    setHomePageContent([
      {
        id: 'hero-title',
        title: 'Hero Title',
        content: 'Welcome to VoiceFlow',
        type: 'header'
      },
      {
        id: 'hero-subtitle',
        title: 'Hero Subtitle',
        content: 'Experience voice-guided clarity assessments that reveal insights about your path forward',
        type: 'text'
      },
      {
        id: 'start-journey-btn',
        title: 'Start Journey Button',
        content: 'Start Your Journey',
        type: 'button'
      },
      {
        id: 'preview-voice-btn',
        title: 'Preview Voice Button',
        content: 'Preview Voice Experience',
        type: 'button'
      },
      {
        id: 'why-voiceflow-title',
        title: 'Why VoiceFlow Section Title',
        content: 'Why VoiceFlow?',
        type: 'header'
      },
      {
        id: 'why-voiceflow-subtitle',
        title: 'Why VoiceFlow Subtitle',
        content: 'Our voice-guided assessments provide deeper insights through human connection and personalized experiences',
        type: 'text'
      }
    ]);
    setFooterContent([
      {
        id: 'footer-title',
        title: 'Footer Title',
        content: 'VoiceFlow',
        type: 'header'
      },
      {
        id: 'footer-tagline',
        title: 'Footer Tagline',
        content: 'Empowering clarity through voice-guided assessments',
        type: 'text'
      }
    ]);
    setResultsPageContent([
      {
        id: 'results-title',
        title: 'Results Page Title',
        content: 'Your VoiceFlow Clarity Snapshot',
        type: 'header'
      },
      {
        id: 'congratulations-message',
        title: 'Congratulations Message',
        content: 'CONGRATULATIONS! Assessment Complete - Your Results Are Ready!',
        type: 'text'
      },
      {
        id: 'ready-explore-title',
        title: 'Ready to Explore More Title',
        content: 'Ready to Explore More?',
        type: 'header'
      },
      {
        id: 'schedule-call-btn',
        title: 'Schedule Call Button',
        content: 'Schedule a Clarity Call',
        type: 'button'
      },
      {
        id: 'resources-btn',
        title: 'Resources Button',
        content: 'Access Additional Resources',
        type: 'button'
      }
    ]);
    
    toast({
      title: "Content Reset",
      description: "All content has been reset to default values.",
    });
  };

  const renderContentEditor = (sections: ContentSection[], setSections: React.Dispatch<React.SetStateAction<ContentSection[]>>) => (
    <div className="space-y-6">
      {sections.map((section) => (
        <Card key={section.id} className="p-4">
          <div className="space-y-3">
            <Label htmlFor={section.id} className="text-sm font-medium flex items-center">
              <Edit3 className="h-4 w-4 mr-2" />
              {section.title}
            </Label>
            {section.type === 'text' ? (
              <Textarea
                id={section.id}
                value={section.content}
                onChange={(e) => updateContent(sections, setSections, section.id, e.target.value)}
                className="min-h-[80px]"
                placeholder={`Enter ${section.title.toLowerCase()}...`}
              />
            ) : (
              <Input
                id={section.id}
                value={section.content}
                onChange={(e) => updateContent(sections, setSections, section.id, e.target.value)}
                placeholder={`Enter ${section.title.toLowerCase()}...`}
              />
            )}
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-gray-600">Edit all text, headers, and button labels across the platform</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={saveContent}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="homepage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="homepage">Home Page</TabsTrigger>
          <TabsTrigger value="results">Results Page</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-4">
          <h3 className="text-lg font-semibold">Home Page Content</h3>
          {renderContentEditor(homePageContent, setHomePageContent)}
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <h3 className="text-lg font-semibold">Results Page Content</h3>
          {renderContentEditor(resultsPageContent, setResultsPageContent)}
        </TabsContent>

        <TabsContent value="footer" className="space-y-4">
          <h3 className="text-lg font-semibold">Footer Content</h3>
          {renderContentEditor(footerContent, setFooterContent)}
        </TabsContent>
      </Tabs>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
        <p className="text-sm text-blue-800">
          Changes made here will update the live content across your VoiceFlow platform. 
          Remember to save your changes before navigating away from this page.
        </p>
      </Card>
    </div>
  );
};

export default ContentManager;

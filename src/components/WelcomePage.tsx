
import { Card } from '@/components/ui/card';
import { VoicePlayer } from './VoicePlayer';
import { LeadCaptureForm } from './LeadCaptureForm';
import { Sparkles, Heart, Target } from 'lucide-react';

interface WelcomePageProps {
  assessmentTitle: string;
  audience: 'individual' | 'business';
  onSubmit: (data: any) => void;
}

export const WelcomePage = ({ assessmentTitle, audience, onSubmit }: WelcomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-full shadow-2xl">
                <Sparkles className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Welcome to Your VoiceCard
            </h1>
            <div className="text-3xl font-bold text-gray-800 mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {assessmentTitle}
              </span>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover powerful insights about yourself through this personalized assessment experience. 
              Your journey to clarity begins here.
            </p>
          </div>

          {/* Voice Player Section */}
          <div className="mb-12">
            <VoicePlayer
              text="Welcome to your VoiceCard assessment! This personalized assessment will help you gain valuable insights. Please fill out your information below, and then we'll begin your journey together."
              autoPlay={true}
              className="mb-8"
            />
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 shadow-lg">
              <div className="text-center">
                <div className="bg-purple-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Personalized Insights</h3>
                <p className="text-gray-600">Get tailored results based on your unique responses</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-lg">
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Voice-Guided Experience</h3>
                <p className="text-gray-600">Enjoy a personal touch with voice narration throughout</p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 shadow-lg">
              <div className="text-center">
                <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Actionable Results</h3>
                <p className="text-gray-600">Receive clear next steps to accelerate your progress</p>
              </div>
            </Card>
          </div>

          {/* Lead Capture Form */}
          <Card className="p-8 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-2 border-purple-200 shadow-xl rounded-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Let's Get Started! 🚀
              </h2>
              <p className="text-lg text-gray-600">
                Please share a few details so we can personalize your experience
              </p>
            </div>
            
            <LeadCaptureForm
              audience={audience}
              onSubmit={onSubmit}
              buttonText="Begin My VoiceCard Assessment"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

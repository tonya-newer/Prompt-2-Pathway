
import { Card } from '@/components/ui/card';
import { WelcomeVoicePlayer } from './WelcomeVoicePlayer';
import { Sparkles, Heart, Target } from 'lucide-react';
import { useSettings } from '../SettingsContext';

interface WelcomePageProps {
  assessmentTitle: string;
  audience: 'individual' | 'business';
  onSubmit: () => void;
}

export const WelcomePage = ({ assessmentTitle, audience, onSubmit }: WelcomePageProps) => {
  const { settings } = useSettings();
  const heading = settings?.welcomePage?.heading.replace('{assessmentTitle}', assessmentTitle);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              
              {settings?.platform?.logo ? (
                  <img
                    src={settings.platform.logo}
                    alt="Platform Logo"
                    className="h-24 w-24 object-contain"
                  />
                ) : (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-full shadow-2xl">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                )}
            </div>
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 px-2"
              style={{ color: settings?.welcomePage?.headingColor }}>
              { heading }
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed px-4"
              style={{ color: settings?.welcomePage?.subHeadingColor }}>
              { settings?.welcomePage?.subHeading }
            </p>
          </div>

          {/* Voice Player Section */}
          <div className="mb-12">
            <WelcomeVoicePlayer className="mb-8" />
          </div>

          {/* Features Section */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-purple-50 border-2 border-purple-200 shadow-lg">
              <div className="text-center">
                <div className="bg-purple-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Target className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Personalized Insights</h3>
                <p className="text-sm sm:text-base text-gray-600">Get tailored results based on your unique responses</p>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-lg">
              <div className="text-center">
                <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Voice-Guided Experience</h3>
                <p className="text-sm sm:text-base text-gray-600">Enjoy a personal touch with voice narration throughout</p>
              </div>
            </Card>
            
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-white to-indigo-50 border-2 border-indigo-200 shadow-lg">
              <div className="text-center">
                <div className="bg-indigo-100 p-3 sm:p-4 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Actionable Results</h3>
                <p className="text-sm sm:text-base text-gray-600">Receive clear next steps to accelerate your progress</p>
              </div>
            </Card>
          </div>

          {/* Start Assessment Section */}
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-2 border-purple-200 shadow-xl rounded-2xl">
            <div className="text-center">
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  ✨ This is your time to reflect, realign, and rise.
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Your personalized Prompt 2 Pathway experience is just one click away.
                </p>
              </div>
              
              <button
                onClick={() => onSubmit()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                Begin My Assessment
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

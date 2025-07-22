
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Trophy, Star, Calendar } from 'lucide-react';
import { VoicePlayer } from '@/components/VoicePlayer';
import { useToast } from "@/hooks/use-toast";
import { CelebrationEffects } from '@/components/CelebrationEffects';

interface AssessmentResult {
  overallScore: number;
  categories: { [key: string]: number };
  interpretation: string;
}

interface AssessmentTemplate {
  id: number;
  title: string;
  audience: 'individual' | 'business';
}

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [assessment, setAssessment] = useState<AssessmentTemplate | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showVoicePlayer, setShowVoicePlayer] = useState(false);
  const [showCelebration, setShowCelebration] = useState(true);

  useEffect(() => {
    const storedResults = localStorage.getItem('assessment-results');
    const storedUserInfo = localStorage.getItem('user-info');
    const assessmentData = location.state?.assessment;

    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
    
    if (assessmentData) {
      setAssessment(assessmentData);
    } else {
      const assessmentTitle = localStorage.getItem('assessment-title');
      const assessmentAudience = localStorage.getItem('assessment-audience');
      if (assessmentTitle) {
        setAssessment({
          id: 0,
          title: assessmentTitle,
          audience: (assessmentAudience as 'individual' | 'business') || 'individual',
        });
      }
    }

    // Load TidyCal script
    const script = document.createElement('script');
    script.src = 'https://asset-tidycal.b-cdn.net/js/embed.js';
    script.async = true;
    document.head.appendChild(script);

    // Extended celebration duration - 12 seconds total
    const celebrationTimer = setTimeout(() => {
      setShowCelebration(false);
    }, 12000);

    // Show voice player after celebration with delay
    const voiceTimer = setTimeout(() => {
      setShowVoicePlayer(true);
    }, 7000);

    return () => {
      clearTimeout(celebrationTimer);
      clearTimeout(voiceTimer);
      document.head.removeChild(script);
    };
  }, [location.state?.assessment]);

  const handleStartOver = () => {
    localStorage.removeItem('assessment-answers');
    localStorage.removeItem('assessment-results');
    localStorage.removeItem('assessment-title');
    localStorage.removeItem('assessment-audience');
    localStorage.removeItem('user-info');
    navigate('/');
  };

  if (!results || !assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const voiceScript = `Hello ${userInfo?.firstName || 'there'}, and congratulations on completing your VoiceCard assessment! This is truly an accomplishment worth celebrating. Taking the time for this kind of self-reflection shows real commitment to your growth. Your overall clarity score of ${results.overallScore} out of 100 is a meaningful indicator.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50">
      {showCelebration && <CelebrationEffects />}
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header with Name */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-2xl">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🎉 CONGRATULATIONS {userInfo?.firstName?.toUpperCase() || 'THERE'}, YOU DID IT! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-2">Assessment Complete - Your Personalized Results Are Here!</p>
            <p className="text-lg text-gray-600">
              You've successfully completed your <span className="font-bold text-blue-600">{assessment.title}</span> assessment. 
              Your detailed insights and actionable next steps are outlined below.
            </p>
          </div>

          {/* Voice Player */}
          {showVoicePlayer && (
            <VoicePlayer
              text={voiceScript}
              autoPlay={true}
              isResultsPage={true}
              className="mb-10"
            />
          )}

          {/* Results in Light Green Box */}
          <Card className="p-10 mb-10 bg-gradient-to-br from-green-50 via-white to-green-50 border-4 border-green-200 shadow-2xl rounded-2xl">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {results.overallScore}
                </div>
                <div className="text-2xl font-semibold text-gray-600 mt-2">
                  out of 100
                </div>
                <div className="absolute -top-2 -right-2">
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Overall Score: {results.overallScore}%
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  {results.interpretation}
                </p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              {Object.entries(results.categories).map(([category, score]) => (
                <div key={category} className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border-2 border-blue-100 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-900 capitalize text-lg">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-2xl font-bold text-blue-600">{score}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Booking Section */}
          <Card className="p-10 mb-10 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-4 border-purple-200 shadow-2xl rounded-2xl">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                Ready to Explore More?
              </h3>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Your journey doesn't end here. We're here to support your continued growth, 
                but only if you're open to exploring what's possible.
              </p>
              
              <div className="space-y-6">
                <Button
                  className="bg-white text-purple-600 hover:bg-purple-50 border-2 border-purple-200 px-12 py-6 text-xl font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Calendar className="h-6 w-6 mr-3" />
                  Schedule a Clarity Call
                </Button>
                
                {/* TidyCal Booking Embed */}
                <div className="mt-8">
                  <div 
                    className="tidycal-embed" 
                    data-path="newerconsulting"
                  ></div>
                </div>
              </div>
              
              <p className="text-gray-500 mt-6 text-lg">
                No pressure - we'll only follow up if you indicate you'd like us to.
              </p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Results;

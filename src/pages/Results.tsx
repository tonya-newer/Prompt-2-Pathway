
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, RefreshCw, Trophy, Star } from 'lucide-react';
import { VoicePlayer } from '@/components/VoicePlayer';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
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

  useEffect(() => {
    const storedResults = localStorage.getItem('assessment-results');
    const assessmentData = location.state?.assessment;

    if (storedResults) {
      setResults(JSON.parse(storedResults));
    }
    
    if (assessmentData) {
      setAssessment(assessmentData);
    } else {
      // Fallback to local storage if available
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
  }, [location.state?.assessment]);

  const handleLeadSubmit = () => {
    toast({
      title: "Thank you!",
      description: "We'll be in touch soon with personalized insights.",
    });
  };

  const handleStartOver = () => {
    localStorage.removeItem('assessment-answers');
    localStorage.removeItem('assessment-results');
    localStorage.removeItem('assessment-title');
    localStorage.removeItem('assessment-audience');
    navigate('/');
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${assessment?.title} Results`,
          text: `I scored ${results?.overallScore}% on the ${assessment?.title} assessment! Check it out:`,
          url: window.location.href,
        });
        toast({
          title: "Results Shared!",
          description: "Thanks for sharing your results!",
        });
      } catch (error) {
        console.error("Sharing failed:", error);
        toast({
          title: "Sharing Failed",
          description: "There was an error sharing your results. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sharing Not Supported",
        description: "Web Share API is not supported in your browser.",
        variant: "destructive",
      });
    }
  };

  // REMOVED: Auto-redirect logic that was causing the page to disappear
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

  const voiceScript = `Congratulations on completing your ${assessment.title} assessment! You've achieved an outstanding overall score of ${results.overallScore} percent. ${results.interpretation}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50">
      <CelebrationEffects />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full shadow-2xl">
                <Trophy className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              🎉 Congratulations! 🎉
            </h1>
            <p className="text-2xl text-gray-700 font-medium">
              You've completed your <span className="font-bold text-blue-600">{assessment.title}</span> assessment
            </p>
          </div>

          {/* Voice Player */}
          <VoicePlayer
            text={voiceScript}
            autoPlay={true}
            isResultsPage={true}
            className="mb-10"
          />

          {/* Enhanced Results Summary */}
          <Card className="p-10 mb-10 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-blue-100 shadow-2xl rounded-2xl">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-6">
                <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {results.overallScore}%
                </div>
                <div className="absolute -top-2 -right-2">
                  <Star className="h-8 w-8 text-yellow-500 fill-current" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Overall Score
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl text-gray-700 leading-relaxed font-medium">
                  {results.interpretation}
                </p>
              </div>
            </div>

            {/* Enhanced Score breakdown */}
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

          {/* Enhanced Lead Capture */}
          <Card className="p-10 mb-10 bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 border-2 border-purple-100 shadow-2xl rounded-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🚀 Want to explore your results further?
              </h3>
              <p className="text-lg text-gray-600">
                Get personalized insights and recommendations delivered to your inbox
              </p>
            </div>
            <LeadCaptureForm
              audience={assessment.audience}
              onSubmit={handleLeadSubmit}
            />
          </Card>

          {/* Enhanced Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={handleShareResults}
              className="flex items-center justify-center px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold"
            >
              <Share2 className="h-5 w-5 mr-3" />
              Share Results
            </Button>
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="flex items-center justify-center px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-300 hover:border-blue-500 font-semibold"
            >
              <RefreshCw className="h-5 w-5 mr-3" />
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

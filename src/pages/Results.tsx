import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, RefreshCw } from 'lucide-react';
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
      if (assessmentTitle) {
        setAssessment({
          id: 0, // Provide a default value or fetch from local storage if available
          title: assessmentTitle,
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
    navigate('/');
  };

  const handleShareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My ${assessment?.title} Results`,
          text: `I scored ${results?.overallScore}% on the ${assessment?.title} assessment! Check it out: ${window.location.href}`,
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

  if (!results || !assessment) {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">No results found. Redirecting to home...</p>
        </div>
      </div>
    );
  }

  const voiceScript = `Congratulations on completing your ${assessment.title} assessment! Your overall score is ${results.overallScore} percent. ${results.interpretation}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <CelebrationEffects />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎉 Congratulations! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              You've completed your {assessment.title} assessment
            </p>
          </div>

          {/* Voice Player */}
          <VoicePlayer
            text={voiceScript}
            autoPlay={true}
            isResultsPage={true}
            className="mb-8"
          />

          {/* Results Summary */}
          <Card className="p-8 mb-8">
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-4">
                {results.overallScore}%
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Your Overall Score
              </h2>
              <div className="max-w-2xl mx-auto">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {results.interpretation}
                </p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {Object.entries(results.categories).map(([category, score]) => (
                <div key={category} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xl font-bold text-blue-600">{score}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Lead Capture */}
          <Card className="p-8 mb-8">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Want to explore your results further?
              </h3>
              <p className="text-gray-600">
                Get personalized insights and recommendations delivered to your inbox
              </p>
            </div>
            <LeadCaptureForm
              assessmentTitle={assessment.title}
              results={results}
              onSubmit={handleLeadSubmit}
            />
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleShareResults}
              className="flex items-center justify-center"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
            <Button
              variant="outline"
              onClick={handleStartOver}
              className="flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Take Another Assessment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

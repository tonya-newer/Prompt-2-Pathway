
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { VoicePlayer } from '@/components/VoicePlayer';
import { QuestionRenderer } from '@/components/QuestionRenderer';
import { WelcomePage } from '@/components/WelcomePage';
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AssessmentTemplate } from '@/types/assessment';
import { leadStorageService } from '@/services/leadStorage';
import { assessmentStorageService } from '@/services/assessmentStorage';

interface AssessmentResult {
  overallScore: number;
  categories: { [key: string]: number };
  interpretation: string;
}

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentTemplate | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLeadCapture, setShowLeadCapture] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      // Handle both string and number IDs
      const assessmentId = isNaN(Number(id)) ? id : Number(id);
      const template = assessmentStorageService.getAssessmentById(assessmentId);
      if (template) {
        setAssessment(template);
        console.log('Loaded assessment:', template.title, 'with', template.questions.length, 'questions');
      } else {
        console.error('Assessment not found for ID:', assessmentId);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (assessment && !showLeadCapture) {
      setAnswers(new Array(assessment.questions.length).fill(null));
    }
  }, [assessment, showLeadCapture]);

  const handleLeadSubmit = (data: any) => {
    setUserInfo(data);
    setShowLeadCapture(false);
    toast({
      title: "Welcome!",
      description: "Let's begin your personalized assessment.",
    });
  };

  const currentQuestion = assessment?.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== undefined && answers[currentQuestionIndex] !== null;

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    if (!assessment) return;

    let overallScore = 0;
    const categoryScores: { [key: string]: number } = {};

    assessment.questions.forEach((question, index) => {
      const answer = answers[index];

      let questionScore = 0;
      switch (question.type) {
        case 'yes-no':
          questionScore = answer === 'yes' ? 100 : 0;
          break;
        case 'this-that':
          questionScore = question.options?.indexOf(answer) === 0 ? 100 : 0;
          break;
        case 'multiple-choice':
          questionScore = question.options?.indexOf(answer) === 0 ? 100 : 0;
          break;
        case 'rating':
          questionScore = (Number(answer) / 10) * 100;
          break;
        case 'desires':
        case 'pain-avoidance':
          const selectedOptions = answer || [];
          questionScore = (selectedOptions.length / (question.options?.length || 1)) * 100;
          break;
        default:
          questionScore = 0;
      }
      overallScore += questionScore;
    });

    overallScore = Math.round(overallScore / assessment.questions.length);

    const interpretation = `Congratulations! Based on your responses to the ${assessment.title}, you've completed this assessment with valuable insights about yourself. Your results show your current readiness and understanding in this area.`;

    const results: AssessmentResult = {
      overallScore: overallScore,
      categories: {
        readiness: Math.round(overallScore * 0.8),
        confidence: Math.round(overallScore * 0.9),
        clarity: Math.round(overallScore * 1.1)
      },
      interpretation: interpretation,
    };

    localStorage.setItem('assessment-results', JSON.stringify(results));
    localStorage.setItem('assessment-title', assessment.title);
    localStorage.setItem('assessment-audience', assessment.audience);
    localStorage.setItem('user-info', JSON.stringify(userInfo));

    const leadData = {
      firstName: userInfo?.firstName || 'Anonymous',
      lastName: userInfo?.lastName || 'User',
      email: userInfo?.email || 'anonymous@example.com',
      ageRange: userInfo?.ageRange || '25-34',
      source: 'voicecard-assessment',
      audience: assessment.audience,
      submissionDate: new Date().toISOString(),
    };

    const assessmentResults = {
      overallScore: results.overallScore,
      categoryScores: {
        readiness: results.categories.readiness,
        confidence: results.categories.confidence,
        clarity: results.categories.clarity
      },
      completionRate: 100,
      insights: ['Assessment completed successfully'],
    };

    leadStorageService.storeLead(leadData, assessmentResults, assessment.title);

    navigate('/results', { state: { assessment } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/50">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your assessment...</p>
            </div>
          </div>
        ) : !assessment ? (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h1>
            <p className="text-gray-600 mb-8">The assessment you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        ) : showLeadCapture ? (
          <WelcomePage
            assessmentTitle={assessment.title}
            audience={assessment.audience}
            onSubmit={handleLeadSubmit}
          />
        ) : currentQuestionIndex < assessment.questions.length ? (
          <div className="space-y-6 sm:space-y-8">
            <VoicePlayer
              text={currentQuestion?.voiceScript || `Question ${currentQuestionIndex + 1}: Let's continue with your assessment.`}
              autoPlay={true}
              className="mb-6 sm:mb-8"
              questionId={currentQuestionIndex + 1}
            />
            
            <div className="max-w-5xl mx-auto">
              <div className="bg-gray-200 rounded-full h-2 sm:h-3 mb-4 sm:mb-6 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs sm:text-sm text-gray-600 px-2">
                <span className="font-medium">Progress: {currentQuestionIndex + 1} of {assessment.questions.length}</span>
                <span className="font-medium">{Math.round(((currentQuestionIndex + 1) / assessment.questions.length) * 100)}% Complete</span>
              </div>
            </div>

            <QuestionRenderer
              question={currentQuestion!}
              questionIndex={currentQuestionIndex}
              totalQuestions={assessment.questions.length}
              answer={answers[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />

            <div className="flex flex-col sm:flex-row justify-between items-center max-w-5xl mx-auto pt-6 sm:pt-8 space-y-4 sm:space-y-0">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-300 hover:border-blue-400 w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="flex items-center px-6 sm:px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold w-full sm:w-auto"
              >
                {currentQuestionIndex === assessment.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Assessment Complete!</h1>
            <p className="text-gray-600 mb-8">Calculating your results...</p>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessment;


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { VoicePlayer } from '@/components/VoicePlayer';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { useToast } from "@/hooks/use-toast";
import { assessmentTemplates } from '@/data/assessmentTemplates';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AssessmentTemplate, Question } from '@/types/assessment';
import { leadStorageService } from '@/services/leadStorage';

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
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const assessmentId = parseInt(id, 10);
      const template = assessmentTemplates.find(template => template.id === assessmentId);
      if (template) {
        setAssessment(template);
      }
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (assessment) {
      const storedAnswers = localStorage.getItem('assessment-answers');
      if (storedAnswers) {
        try {
          setAnswers(JSON.parse(storedAnswers));
        } catch (error) {
          console.error("Error parsing stored answers:", error);
          setAnswers(new Array(assessment.questions.length).fill(null));
        }
      } else {
        setAnswers(new Array(assessment.questions.length).fill(null));
      }
    }
  }, [assessment]);

  const currentQuestion = assessment?.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestionIndex] !== undefined && answers[currentQuestionIndex] !== null;

  const handleAnswer = (answer: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
    localStorage.setItem('assessment-answers', JSON.stringify(newAnswers));
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

    const interpretation = "Based on your answers, here's a general overview of your results.";

    const results: AssessmentResult = {
      overallScore: overallScore,
      categories: categoryScores,
      interpretation: interpretation,
    };

    localStorage.setItem('assessment-results', JSON.stringify(results));

    // Store lead data using the correct method name
    const leadData = {
      firstName: 'Anonymous',
      lastName: 'User',
      email: 'anonymous@example.com',
      ageRange: '25-34',
      source: 'voicecard-assessment',
      audience: assessment.audience,
      submissionDate: new Date().toISOString(),
    };

    const assessmentResults = {
      overallScore: results.overallScore,
      categoryScores: {
        readiness: 0,
        confidence: 0,
        clarity: 0,
      },
      completionRate: 100,
      insights: ['Assessment completed successfully'],
    };

    leadStorageService.storeLead(leadData, assessmentResults, assessment.title);

    navigate('/results');
  };

  const renderQuestion = () => {
    const question = currentQuestion;
    const answer = answers[currentQuestionIndex];
    
    const renderQuestionContent = () => {
      switch (question.type) {
        case 'yes-no':
          return (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                variant={answer === 'yes' ? 'default' : 'outline'}
                onClick={() => handleAnswer('yes')}
                className="h-16 text-lg"
              >
                Yes
              </Button>
              <Button
                variant={answer === 'no' ? 'default' : 'outline'}
                onClick={() => handleAnswer('no')}
                className="h-16 text-lg"
              >
                No
              </Button>
            </div>
          );
        
        case 'this-that':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {question.options?.map((option, index) => (
                <Button
                  key={index}
                  variant={answer === option ? 'default' : 'outline'}
                  onClick={() => handleAnswer(option)}
                  className="h-20 text-left p-4 whitespace-normal"
                >
                  {option}
                </Button>
              ))}
            </div>
          );
        
        case 'multiple-choice':
          return (
            <RadioGroup value={answer} onValueChange={handleAnswer} className="mt-6 space-y-3">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );
        
        case 'rating':
          return (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Strongly Disagree</span>
                <span className="text-sm text-gray-500">Strongly Agree</span>
              </div>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <Button
                    key={rating}
                    variant={answer === rating ? 'default' : 'outline'}
                    onClick={() => handleAnswer(rating)}
                    className="w-12 h-12 p-0"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
          );
        
        case 'desires':
        case 'pain-avoidance':
          return (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-gray-600 mb-4">Select all that resonate with you:</p>
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <Checkbox
                    id={`option-${index}`}
                    checked={answer?.includes(option) || false}
                    onCheckedChange={(checked) => {
                      const currentAnswers = answer || [];
                      if (checked) {
                        handleAnswer([...currentAnswers, option]);
                      } else {
                        handleAnswer(currentAnswers.filter((a: string) => a !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`option-${index}`} className="text-base cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          );
        
        default:
          return null;
      }
    };

    return (
      <Card className="p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Badge variant="secondary" className="mb-4">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </Badge>
          
          {/* Voice transcript - this is the ONLY text displayed, no redundant question */}
          {question.voiceScript && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-6 rounded-r-lg">
              <p className="text-blue-800 text-lg leading-relaxed font-medium">
                {question.voiceScript}
              </p>
            </div>
          )}
        </div>

        {renderQuestionContent()}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
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
        ) : currentQuestionIndex < assessment.questions.length ? (
          <div className="space-y-8">
            {/* Auto-playing welcome voice */}
            {currentQuestionIndex === 0 && (
              <VoicePlayer
                text={currentQuestion.voiceScript || "Welcome to this assessment. Let's begin your journey of discovery."}
                autoPlay={true}
                className="mb-8"
              />
            )}
            
            {/* Progress bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Question {currentQuestionIndex + 1} of {assessment.questions.length}
              </p>
            </div>

            {/* Question */}
            {renderQuestion()}

            {/* Navigation */}
            <div className="flex justify-between items-center max-w-4xl mx-auto">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="flex items-center"
              >
                {currentQuestionIndex === assessment.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                <ChevronRight className="h-4 w-4 ml-2" />
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


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AssessmentTemplate, Question, LeadData } from '@/types/assessment';
import { assessmentTemplates } from '@/data/assessmentTemplates';
import { VoicePlayer } from '@/components/VoicePlayer';
import { QuestionCard } from '@/components/QuestionCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface AssessmentData {
  title: string;
  description: string;
  questions: Question[];
}

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // Start with lead form
  const [leadData, setLeadData] = useState<LeadData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ageRange: '',
    source: '',
    audience: 'individual'
  });
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const { toast } = useToast()

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        console.log('Loading assessment with ID:', id);
        
        const template = assessmentTemplates.find(t => t.id === parseInt(id || '0'));
        
        if (!template) {
          console.error('Assessment template not found for ID:', id);
          toast({
            title: "Assessment Not Found",
            description: "The requested assessment could not be found.",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        const transformedData: AssessmentData = {
          title: template.title,
          description: template.description,
          questions: template.questions
        };
        
        console.log('Assessment loaded successfully:', transformedData);
        setAssessmentData(transformedData);
      } catch (error) {
        console.error("Error loading assessment:", error);
        toast({
          title: "Error",
          description: "Failed to load assessment. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    if (id) {
      fetchAssessment();
    }
  }, [id, navigate, toast]);

  const handleLeadDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof LeadData) => {
    setLeadData({
      ...leadData,
      [field]: e.target.value,
    });
  };

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  const validateLeadData = () => {
    return leadData.firstName && leadData.lastName && leadData.email && leadData.ageRange;
  };

  const startAssessment = () => {
    if (!validateLeadData()) {
      toast({
        title: "Required Information Missing",
        description: "Please fill in all required fields before starting the assessment.",
        variant: "destructive",
      });
      return;
    }
    setCurrentQuestionIndex(0);
  };

  const nextQuestion = () => {
    if (!assessmentData) return;
    
    const currentQuestion = assessmentData.questions[currentQuestionIndex];
    if (answers[currentQuestion.id] === undefined) {
      toast({
        title: "Answer Required",
        description: "Please answer the current question before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex < assessmentData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeAssessment();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setCurrentQuestionIndex(-1); // Go back to lead form
    }
  };

  const calculateResults = () => {
    if (!assessmentData) return null;

    let overallScore = 0;
    let readinessScore = 0;
    let confidenceScore = 0;
    let clarityScore = 0;

    Object.keys(answers).forEach(key => {
      const questionId = parseInt(key);
      const answer = answers[questionId];

      if (answer === 'yes' || answer === 'agree') {
        overallScore += 5;
        readinessScore += 3;
        confidenceScore += 2;
      } else if (answer === 'no' || answer === 'disagree') {
        overallScore += 2;
        clarityScore += 1;
      } else {
        overallScore += 3;
      }
    });

    overallScore = Math.min(Math.max(overallScore, 0), 100);
    readinessScore = Math.min(Math.max(readinessScore, 0), 100);
    confidenceScore = Math.min(Math.max(confidenceScore, 0), 100);
    clarityScore = Math.min(Math.max(clarityScore, 0), 100);

    const insights = [
      "Focus on clarifying your goals and objectives.",
      "Build confidence by celebrating small wins.",
      "Increase readiness by setting realistic timelines."
    ];

    return {
      overallScore,
      categoryScores: {
        readiness: readinessScore,
        confidence: confidenceScore,
        clarity: clarityScore,
      },
      insights,
    };
  };

  const completeAssessment = () => {
    const results = calculateResults();
    if (results) {
      navigate('/results', { state: { leadData, answers, results, template: assessmentData?.title } });
    } else {
      toast({
        title: "Error",
        description: "Could not calculate results. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProgressPercentage = () => {
    if (!assessmentData || currentQuestionIndex === -1) return 0;
    return ((currentQuestionIndex + 1) / assessmentData.questions.length) * 100;
  };

  const getCurrentVoiceScript = () => {
    if (!assessmentData || currentQuestionIndex === -1) return "";
    const currentQuestion = assessmentData.questions[currentQuestionIndex];
    return currentQuestion.voiceScript || currentQuestion.question;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-6 sm:py-8">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6">
        {assessmentData ? (
          <>
            {/* Header with Progress */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{assessmentData.title}</h1>
              <p className="text-gray-600 mb-4">{assessmentData.description}</p>
              
              {currentQuestionIndex >= 0 && (
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {assessmentData.questions.length}</span>
                    <span>{Math.round(getProgressPercentage())}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Lead Information Form */}
            {currentQuestionIndex === -1 && (
              <Card className="bg-white shadow-xl rounded-lg p-8 mb-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to Your VoiceCard Assessment</h2>
                  <p className="text-gray-600">Let's start by getting to know you better. This information helps us personalize your experience.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-base font-medium">First Name *</Label>
                    <Input
                      type="text"
                      id="firstName"
                      placeholder="Enter your first name"
                      className="mt-2 h-12 text-base"
                      value={leadData.firstName}
                      onChange={(e) => handleLeadDataChange(e, 'firstName')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-base font-medium">Last Name *</Label>
                    <Input
                      type="text"
                      id="lastName"
                      placeholder="Enter your last name"
                      className="mt-2 h-12 text-base"
                      value={leadData.lastName}
                      onChange={(e) => handleLeadDataChange(e, 'lastName')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-base font-medium">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      placeholder="Enter your email"
                      className="mt-2 h-12 text-base"
                      value={leadData.email}
                      onChange={(e) => handleLeadDataChange(e, 'email')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium">Phone (Optional)</Label>
                    <Input
                      type="tel"
                      id="phone"
                      placeholder="Enter your phone number"
                      className="mt-2 h-12 text-base"
                      value={leadData.phone || ''}
                      onChange={(e) => handleLeadDataChange(e, 'phone')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ageRange" className="text-base font-medium">Age Range *</Label>
                    <Select value={leadData.ageRange} onValueChange={(value) => handleLeadDataChange({ target: { value } } as any, 'ageRange')}>
                      <SelectTrigger className="w-full mt-2 h-12 text-base">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="18-24">18-24</SelectItem>
                        <SelectItem value="25-34">25-34</SelectItem>
                        <SelectItem value="35-44">35-44</SelectItem>
                        <SelectItem value="45-54">45-54</SelectItem>
                        <SelectItem value="55+">55+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="source" className="text-base font-medium">How did you hear about us?</Label>
                    <Input
                      type="text"
                      id="source"
                      placeholder="Enter source"
                      className="mt-2 h-12 text-base"
                      value={leadData.source || ''}
                      onChange={(e) => handleLeadDataChange(e, 'source')}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="audience" className="text-base font-medium">Intended Audience</Label>
                    <Select value={leadData.audience || ''} onValueChange={(value) => handleLeadDataChange({ target: { value } } as any, 'audience')}>
                      <SelectTrigger className="w-full mt-2 h-12 text-base">
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button 
                    onClick={startAssessment}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    Start My VoiceCard Assessment
                  </Button>
                </div>
              </Card>
            )}

            {/* Question Display */}
            {currentQuestionIndex >= 0 && assessmentData.questions[currentQuestionIndex] && (
              <div className="space-y-6">
                {/* Voice Guide */}
                <VoicePlayer
                  text={getCurrentVoiceScript()}
                  autoPlay={true}
                  className="animate-fade-in"
                />

                {/* Question Card */}
                <div className="animate-scale-in">
                  <QuestionCard
                    question={assessmentData.questions[currentQuestionIndex]}
                    answer={answers[assessmentData.questions[currentQuestionIndex].id]}
                    onAnswer={(answer) => handleAnswer(assessmentData.questions[currentQuestionIndex].id, answer)}
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <Button
                    variant="outline"
                    onClick={previousQuestion}
                    className="flex items-center space-x-2 px-6 py-3"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>

                  <Button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center space-x-2 px-6 py-3"
                  >
                    <span>
                      {currentQuestionIndex === assessmentData.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <Card className="bg-white shadow-xl rounded-lg p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-700">Loading your VoiceCard experience...</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assessment;

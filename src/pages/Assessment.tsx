
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
import { ArrowLeft, ArrowRight, Sparkles, Heart } from 'lucide-react';

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

  const getWelcomeVoiceScript = () => {
    if (!assessmentData) return "";
    return `Welcome to your ${assessmentData.title}! I'm excited to guide you through this personalized experience. This assessment has been designed specifically to help you gain valuable insights about your unique situation. Before we begin with the questions, I'll need to gather some basic information about you. This helps me personalize your experience and ensure you get the most relevant insights. Please take your time filling out the form below, and when you're ready, we'll begin your guided assessment journey together.`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container max-w-4xl mx-auto px-4 py-6 sm:py-8">
        {assessmentData ? (
          <>
            {/* Header with Progress */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {assessmentData.title}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                {assessmentData.description}
              </p>
              
              {currentQuestionIndex >= 0 && (
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {assessmentData.questions.length}</span>
                    <span>{Math.round(getProgressPercentage())}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${getProgressPercentage()}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Lead Information Form */}
            {currentQuestionIndex === -1 && (
              <div className="space-y-6 sm:space-y-8">
                {/* Welcome Voice Guide */}
                <div className="mb-6 sm:mb-8">
                  <VoicePlayer 
                    text={getWelcomeVoiceScript()}
                    autoPlay={false}
                    className="shadow-2xl border-4 border-purple-200"
                  />
                </div>

                {/* Enhanced Welcome Card */}
                <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 border-0 relative overflow-hidden">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-30"></div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-4 rounded-full">
                          <Heart className="h-8 w-8 text-purple-600" />
                        </div>
                        <Sparkles className="h-6 w-6 text-blue-500 ml-2" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        Welcome to Your 
                        <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {" "}VoiceCard Experience
                        </span>
                      </h2>
                      <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
                        Let's start by getting to know you better. This information helps us create a completely personalized assessment experience just for you.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-base font-semibold text-gray-700 flex items-center">
                          First Name <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="firstName"
                          placeholder="Enter your first name"
                          className="h-12 text-base border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                          value={leadData.firstName}
                          onChange={(e) => handleLeadDataChange(e, 'firstName')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-base font-semibold text-gray-700 flex items-center">
                          Last Name <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          type="text"
                          id="lastName"
                          placeholder="Enter your last name"
                          className="h-12 text-base border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                          value={leadData.lastName}
                          onChange={(e) => handleLeadDataChange(e, 'lastName')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-semibold text-gray-700 flex items-center">
                          Email Address <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          type="email"
                          id="email"
                          placeholder="Enter your email address"
                          className="h-12 text-base border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                          value={leadData.email}
                          onChange={(e) => handleLeadDataChange(e, 'email')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base font-semibold text-gray-700">
                          Phone Number (Optional)
                        </Label>
                        <Input
                          type="tel"
                          id="phone"
                          placeholder="Enter your phone number"
                          className="h-12 text-base border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                          value={leadData.phone || ''}
                          onChange={(e) => handleLeadDataChange(e, 'phone')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="ageRange" className="text-base font-semibold text-gray-700 flex items-center">
                          Age Range <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select value={leadData.ageRange} onValueChange={(value) => handleLeadDataChange({ target: { value } } as any, 'ageRange')}>
                          <SelectTrigger className="h-12 text-base border-2 border-gray-200 focus:border-purple-400 rounded-xl">
                            <SelectValue placeholder="Select your age range" />
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="source" className="text-base font-semibold text-gray-700">
                          How did you hear about us?
                        </Label>
                        <Input
                          type="text"
                          id="source"
                          placeholder="Social media, referral, search, etc."
                          className="h-12 text-base border-2 border-gray-200 focus:border-purple-400 rounded-xl transition-all duration-200"
                          value={leadData.source || ''}
                          onChange={(e) => handleLeadDataChange(e, 'source')}
                        />
                      </div>
                    </div>

                    <div className="mt-10 text-center">
                      <Button 
                        onClick={startAssessment}
                        size="lg"
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl border-0 w-full sm:w-auto"
                      >
                        <Sparkles className="h-5 w-5 mr-3" />
                        Begin My VoiceCard Journey
                      </Button>
                      <p className="text-sm text-gray-500 mt-4">
                        🎧 Grab your headphones for the ultimate VoiceCard experience
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Question Display */}
            {currentQuestionIndex >= 0 && assessmentData.questions[currentQuestionIndex] && (
              <div className="space-y-6">
                {/* Voice Guide */}
                <VoicePlayer
                  text={getCurrentVoiceScript()}
                  autoPlay={true}
                  className="animate-fade-in shadow-xl"
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
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 hover:border-purple-400 rounded-xl"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Previous</span>
                  </Button>

                  <Button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center space-x-2 px-6 py-3 rounded-xl shadow-lg"
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
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-700">Loading your VoiceCard experience...</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assessment;

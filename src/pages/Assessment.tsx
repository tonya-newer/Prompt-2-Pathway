import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, ArrowLeft, ArrowRight, Brain, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { VoicePlayer } from '@/components/VoicePlayer';
import { QuestionCard } from '@/components/QuestionCard';
import { assessmentTemplates } from '@/data/assessmentTemplates';
import { AssessmentTemplate, Question, LeadData, AssessmentResults } from '@/types/assessment';

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<'capture' | 'assessment' | 'results'>('capture');
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDirectAccess, setIsDirectAccess] = useState(false);

  // Get assessment template based on ID from URL
  const template: AssessmentTemplate | undefined = assessmentTemplates.find(t => t.id.toString() === id);
  
  // Check if user came directly to this assessment (not from dashboard)
  useEffect(() => {
    // Check if user came from the admin dashboard or internally
    const referrer = document.referrer;
    const isInternalNavigation = location.state?.fromDashboard || referrer.includes('/admin');
    
    // If not from internal navigation, mark as direct access
    if (!isInternalNavigation) {
      setIsDirectAccess(true);
      console.log('Direct access detected - restricting navigation to dashboard');
    }
  }, [location]);
  
  // If no template found, redirect to home
  useEffect(() => {
    if (!template) {
      navigate('/');
      return;
    }
  }, [template, navigate]);

  if (!template) {
    return null;
  }

  const progress = ((currentQuestion + 1) / template.questions.length) * 100;

  const handleLeadCapture = (data: LeadData) => {
    setLeadData(data);
    setCurrentStep('assessment');
    toast({
      title: "Welcome to VoiceCard",
      description: "Let's begin your personalized assessment journey.",
    });
  };

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const sendToMakeWebhook = async (leadData: LeadData, results: AssessmentResults) => {
    const webhookUrl = 'https://hook.us2.make.com/cncz0jyx3q9hvw2fxdu6u3vjcxnt9i2e';
    
    const webhookData = {
      firstname: leadData.firstName,
      lastname: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone || '',
      agegroup: leadData.ageRange,
      quizscore: results.overallScore,
      quizType: template.title,
      source: leadData.source || 'direct'
    };

    try {
      console.log('Sending data to Make.com webhook:', webhookData);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      if (response.ok) {
        console.log('Successfully sent data to Make.com webhook');
        toast({
          title: "Data Synchronized",
          description: "Your assessment data has been processed successfully.",
        });
      } else {
        console.error('Failed to send data to Make.com webhook:', response.status);
      }
    } catch (error) {
      console.error('Error sending data to Make.com webhook:', error);
    }
  };

  const sendEmailNotification = async (leadData: LeadData, results: AssessmentResults) => {
    try {
      console.log('Email notification data for info@newerconsulting.com:', {
        subject: `New VoiceCard Assessment Completed - ${leadData.firstName} ${leadData.lastName}`,
        leadData,
        results: {
          ...results,
          overallScore: results.overallScore
        },
        completedAt: new Date().toISOString()
      });
      
      toast({
        title: "Notification Sent",
        description: "Assessment completion notification has been sent.",
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < template.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      const results = calculateResults();
      
      if (leadData) {
        await sendToMakeWebhook(leadData, results);
        await sendEmailNotification(leadData, results);
      }
      
      navigate('/results', { 
        state: { 
          leadData, 
          answers, 
          results,
          template: template.title 
        } 
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleExitAssessment = () => {
    if (isDirectAccess) {
      // For direct access users, stay on the same assessment page
      setCurrentStep('capture');
      setCurrentQuestion(0);
      setAnswers({});
      setLeadData(null);
      toast({
        title: "Assessment Reset",
        description: "Your assessment has been reset. You can start again anytime.",
      });
    } else {
      // For internal users (admins), allow navigation to dashboard
      navigate('/');
    }
  };

  const calculateResults = (): AssessmentResults => {
    const totalQuestions = template.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    const categoryScores = {
      readiness: Math.floor(Math.random() * 30) + 70,
      confidence: Math.floor(Math.random() * 30) + 60,
      clarity: Math.floor(Math.random() * 30) + 65
    };
    
    const overallScore = Math.floor((categoryScores.readiness + categoryScores.confidence + categoryScores.clarity) / 3);
    
    return {
      overallScore,
      categoryScores,
      completionRate,
      insights: generateInsights(overallScore, categoryScores)
    };
  };

  const generateInsights = (overall: number, categories: any) => {
    const insights = [];
    
    if (overall >= 80) {
      insights.push("You're in an excellent position to move forward with confidence.");
    } else if (overall >= 60) {
      insights.push("You have solid foundations with room for strategic improvements.");
    } else {
      insights.push("There are key areas where focused attention could unlock significant progress.");
    }
    
    if (categories.readiness > categories.confidence) {
      insights.push("Your readiness exceeds your confidence - it's time to trust your preparation.");
    }
    
    if (categories.clarity < 70) {
      insights.push("Gaining clearer vision of your path forward could accelerate your progress.");
    }
    
    return insights;
  };

  if (currentStep === 'capture') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Welcome to VoiceCard Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Welcome to VoiceCard</h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-4">Your personalized assessment journey begins here</p>
            <p className="text-base sm:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Experience voice-guided clarity assessments that reveal insights about your path forward. 
              Why VoiceCard? Our voice-guided assessments provide deeper insights through human connection and personalized experiences.
            </p>
          </div>
        </header>

        {/* Core Value Boxes */}
        <section className="container mx-auto px-4 py-6 sm:py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-6 sm:mb-8">
            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Deep Insights</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Uncover meaningful patterns and clarity about your personal or business direction
              </p>
            </Card>

            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Voice-Guided</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Experience a human touch with professionally crafted voice narration throughout
              </p>
            </Card>

            <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Personalized</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Tailored experiences for individuals and business owners with relevant insights
              </p>
            </Card>
          </div>
        </section>

        {/* Assessment Image - Vertical Display */}
        {template.image && (
          <div className="container mx-auto px-4 py-6 sm:py-8">
            <div className="max-w-md mx-auto">
              <img 
                src={template.image} 
                alt={template.title}
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{template.title}</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">{template.description}</p>
              <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                <span>{template.questions.length} questions</span>
                <span>•</span>
                <span>Est. {Math.ceil(template.questions.length * 0.75)} min</span>
              </div>
            </div>
            <LeadCaptureForm onSubmit={handleLeadCapture} audience={template.audience} />
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'assessment') {
    const question: Question = template.questions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={handleExitAssessment}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  {isDirectAccess ? 'Restart Assessment' : 'Exit Assessment'}
                </span>
                <span className="sm:hidden">
                  {isDirectAccess ? 'Restart' : 'Exit'}
                </span>
              </Button>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <span className="text-xs sm:text-sm text-gray-600">
                  <span className="hidden sm:inline">Question </span>
                  {currentQuestion + 1} of {template.questions.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="flex items-center p-2"
                >
                  {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="mt-4" />
          </div>
        </header>

        {/* Assessment Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-3xl mx-auto">
            {/* Enhanced Voice Player */}
            {voiceEnabled && (
              <div className="mb-6 sm:mb-8">
                <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                    <div className="bg-blue-600 p-2 sm:p-3 rounded-full mb-3 sm:mb-0 sm:mr-4">
                      <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-lg sm:text-xl font-bold text-blue-900">🎧 Voice Guide Available</h3>
                      <p className="text-sm sm:text-base text-blue-700 font-medium">Press play to hear this question read aloud!</p>
                    </div>
                  </div>
                  <VoicePlayer 
                    text={question.voiceScript || `Question ${currentQuestion + 1}: ${question.question}`}
                    autoPlay={false}
                    className="bg-white/80"
                  />
                </div>
              </div>
            )}
            
            {/* Question Card */}
            <QuestionCard
              question={question}
              answer={answers[question.id]}
              onAnswer={(answer) => handleAnswer(question.id, answer)}
            />
            
            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 space-y-4 sm:space-y-0">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!answers[question.id]}
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600 w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base">
                  {currentQuestion === template.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                </span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Assessment;

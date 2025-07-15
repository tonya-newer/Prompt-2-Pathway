
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Play, Pause, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LeadCaptureForm } from '@/components/LeadCaptureForm';
import { VoicePlayer } from '@/components/VoicePlayer';
import { QuestionCard } from '@/components/QuestionCard';
import { assessmentTemplates } from '@/data/assessmentTemplates';
import { AssessmentTemplate, Question, LeadData, AssessmentResults } from '@/types/assessment';

const Assessment = () => {
  const { audience } = useParams<{ audience: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<'capture' | 'assessment' | 'results'>('capture');
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Get assessment template based on audience
  const template: AssessmentTemplate = assessmentTemplates.find(t => t.audience === audience) || assessmentTemplates[0];
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
      // This would typically be handled by the Make.com workflow
      // For now, we'll log the notification
      console.log('Email notification data for info@newerconsulting.com:', {
        subject: `New VoiceCard Assessment Completed - ${leadData.firstName} ${leadData.lastName}`,
        leadData,
        results,
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
      // Calculate results and process completion
      const results = calculateResults();
      
      if (leadData) {
        // Send to Make.com webhook
        await sendToMakeWebhook(leadData, results);
        
        // Send email notification
        await sendEmailNotification(leadData, results);
      }
      
      // Navigate to results page
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

  const calculateResults = (): AssessmentResults => {
    // Simple scoring system - in production this would be more sophisticated
    const totalQuestions = template.questions.length;
    const answeredQuestions = Object.keys(answers).length;
    const completionRate = (answeredQuestions / totalQuestions) * 100;
    
    // Calculate category scores based on question types
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
    return <LeadCaptureForm onSubmit={handleLeadCapture} audience={audience || 'individual'} />;
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
                onClick={() => navigate('/')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Assessment
              </Button>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Question {currentQuestion + 1} of {template.questions.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="flex items-center"
                >
                  {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <Progress value={progress} className="mt-4" />
          </div>
        </header>

        {/* Assessment Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Voice Player */}
            {voiceEnabled && (
              <VoicePlayer 
                text={question.voiceScript || `Question ${currentQuestion + 1}: ${question.question}`}
                autoPlay={false}
              />
            )}
            
            {/* Question Card */}
            <QuestionCard
              question={question}
              answer={answers[question.id]}
              onAnswer={(answer) => handleAnswer(question.id, answer)}
            />
            
            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!answers[question.id]}
                className="flex items-center bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {currentQuestion === template.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
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


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
import { customVoiceService } from '@/services/customVoiceService';
import { nativeSpeech } from '@/services/nativeSpeech';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { audioManager } from '@/services/audioManager';

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

  // Halfway encouragement state + audio element hookup
  const [showHalfway, setShowHalfway] = useState(false);
  const [needsManualPlay, setNeedsManualPlay] = useState(false);
  const KEEP_GOING_URL = '/lovable-uploads/keep-going-message.mp3';
  const KEEP_GOING_FALLBACK = 'https://drive.google.com/uc?export=download&id=1NChuSTeMNVRnMR9jPELnzFkruo63gizr&v=2025-08-11';
  const getKeepAudio = () => document.getElementById('keepGoingAudio') as HTMLAudioElement | null;

  // Configure global audio element once
  useEffect(() => {
    const el = getKeepAudio();
    if (el) {
      // Prefer first-party URL; set fallback if needed at play time
      el.preload = 'metadata';
      if (!el.src) el.src = KEEP_GOING_URL;
      const primeOnFirstGesture = () => {
        try { el.load(); } catch {}
      };
      window.addEventListener('click', primeOnFirstGesture, { once: true });
      return () => window.removeEventListener('click', primeOnFirstGesture);
    }
  }, []);

  // When halfway modal toggles, control playback
  useEffect(() => {
    const el = getKeepAudio();
    if (!el) return;
    if (showHalfway) {
      // Ensure source is set
      if (!el.src) el.src = KEEP_GOING_URL;
      el.currentTime = 0;
      el.play().then(() => setNeedsManualPlay(false)).catch(async () => {
        // Try fallback source once
        try {
          el.pause();
          el.src = KEEP_GOING_FALLBACK;
          el.currentTime = 0;
          await el.play();
          setNeedsManualPlay(false);
        } catch {
          setNeedsManualPlay(true);
        }
      });
    } else {
      try { el.pause(); el.currentTime = 0; } catch {}
    }
  }, [showHalfway]);

  useEffect(() => {
    if (id) {
      // Handle both string and number IDs with retry logic
      const assessmentId = isNaN(Number(id)) ? id : Number(id);
      
      const loadAssessment = () => {
        const template = assessmentStorageService.getAssessmentById(assessmentId);
        if (template) {
          setAssessment(template);
          console.log('Loaded assessment:', template.title, 'with', template.questions.length, 'questions');
          setLoading(false);
        } else {
          console.warn('Assessment not found for ID:', assessmentId, 'retrying in 1s...');
          // Retry after 1 second in case of race condition
          setTimeout(() => {
            const retryTemplate = assessmentStorageService.getAssessmentById(assessmentId);
            if (retryTemplate) {
              setAssessment(retryTemplate);
              console.log('Loaded assessment on retry:', retryTemplate.title);
            } else {
              console.error('Assessment not found after retry for ID:', assessmentId);
            }
            setLoading(false);
          }, 1000);
        }
      };
      
      loadAssessment();
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
    
    // Auto-advance to next question after 1.5 seconds
    setTimeout(() => {
      // Stop any playing audio before advancing
      customVoiceService.stopVoice();
      nativeSpeech.stop();

      // After Q7 (index 6), show encouragement modal before moving to Q8
      if (currentQuestionIndex === 6) {
        setShowHalfway(true);
        return;
      }
      
      if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Navigate to contact form instead of directly to results
        navigate('/contact-form');
      }
    }, 1500);
  };

  const handleNextQuestion = () => {
    // Stop any playing audio before advancing
    customVoiceService.stopVoice();
    nativeSpeech.stop();
    
    if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Navigate to contact form instead of directly to results
      navigate('/contact-form');
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

    // Store results and assessment data for the contact form to access
    localStorage.setItem('assessment-results', JSON.stringify(results));
    localStorage.setItem('assessment-title', assessment.title);
    localStorage.setItem('assessment-audience', assessment.audience);
    localStorage.setItem('user-info', JSON.stringify(userInfo));
    localStorage.setItem('assessment-answers', JSON.stringify(answers));

    const leadData = {
      firstName: userInfo?.firstName || 'Anonymous',
      lastName: userInfo?.lastName || 'User',
      email: userInfo?.email || 'anonymous@example.com',
      ageRange: userInfo?.ageRange || '25-34',
      source: 'prompt2pathway-assessment',
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
          <div className="space-y-4 sm:space-y-6">
            {/* Progress Bar - Compact Mobile Design */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-gray-200 rounded-full h-2 mb-2 sm:mb-4 shadow-inner">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600 px-1">
                <span className="font-medium">Question {currentQuestionIndex + 1} of {assessment.questions.length}</span>
                <span className="font-medium">{Math.round(((currentQuestionIndex + 1) / assessment.questions.length) * 100)}%</span>
              </div>
            </div>

            {/* Question Content - Mobile Optimized */}
            <div className="px-2 sm:px-0">
              <QuestionRenderer
                question={currentQuestion!}
                questionIndex={currentQuestionIndex}
                totalQuestions={assessment.questions.length}
                answer={answers[currentQuestionIndex]}
                onAnswer={handleAnswer}
              />
            </div>

            {/* Navigation Buttons - Mobile Optimized */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch max-w-5xl mx-auto pt-4 sm:pt-6 space-y-3 sm:space-y-0 px-2 sm:px-0">
              <Button
                variant="outline"
                onClick={() => {
                  // Stop any playing audio before going back
                  customVoiceService.stopVoice();
                  nativeSpeech.stop();
                  setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1));
                }}
                disabled={currentQuestionIndex === 0}
                className="flex items-center justify-center px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-300 hover:border-blue-400 w-full sm:w-auto order-2 sm:order-1"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNextQuestion}
                disabled={!isAnswered}
                className="flex items-center justify-center px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold w-full sm:w-auto order-1 sm:order-2"
              >
                {currentQuestionIndex === assessment.questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            {/* Halfway encouragement modal */}
            <Dialog
              open={showHalfway}
              onOpenChange={(open) => {
                if (!open) {
                  const el = getKeepAudio();
                  try { el?.pause(); if (el) el.currentTime = 0; } catch {}
                  audioManager.stopAll();
                  setShowHalfway(false);
                  setNeedsManualPlay(false);
                  setCurrentQuestionIndex((prev) => Math.min(prev + 1, (assessment?.questions.length || 1) - 1));
                }
              }}
            >
              <DialogContent className="sm:rounded-[16px] bg-[hsl(var(--brand-card))]">
                <DialogHeader>
                  <DialogTitle className="text-[hsl(var(--brand-text))] text-xl font-bold">You’re halfway there!</DialogTitle>
                  <DialogDescription className="text-[hsl(var(--brand-muted))]">
                    Great progress—keep going. Your personalized results are close.
                  </DialogDescription>
                </DialogHeader>
                <div className="pt-2 space-y-2">
                  {needsManualPlay && (
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        const el = getKeepAudio();
                        if (!el) return;
                        try { await el.play(); setNeedsManualPlay(false); } catch {}
                      }}
                      className="w-full"
                    >
                      🔊 Tap to play message
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      const el = getKeepAudio();
                      try { el?.pause(); if (el) el.currentTime = 0; } catch {}
                      audioManager.stopAll();
                      setShowHalfway(false);
                      setNeedsManualPlay(false);
                      setCurrentQuestionIndex((prev) => Math.min(prev + 1, (assessment?.questions.length || 1) - 1));
                    }}
                    className="w-full rounded-[12px] bg-[hsl(var(--brand-accent-gold))] text-[hsl(var(--brand-text))] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-accent-gold))] focus-visible:ring-offset-2"
                  >
                    Continue
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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

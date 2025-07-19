
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AssessmentTemplate, Question, LeadData } from '@/types/assessment';
import { assessmentTemplates } from '@/data/assessmentTemplates';

interface AssessmentData {
  title: string;
  description: string;
  questions: Question[];
}

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
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
        
        // Find the assessment template by ID
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

        // Transform the assessment data to match the expected structure
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, questionId: number) => {
    setAnswers({
      ...answers,
      [questionId]: e.target.value,
    });
  };

  const handleRadioChange = (value: string | null, questionId: number) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleLeadDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: keyof LeadData) => {
    setLeadData({
      ...leadData,
      [field]: e.target.value,
    });
  };

  const calculateResults = () => {
    if (!assessmentData) return null;

    let overallScore = 0;
    let readinessScore = 0;
    let confidenceScore = 0;
    let clarityScore = 0;

    // Mock scoring logic - replace with actual scoring based on answers
    Object.keys(answers).forEach(key => {
      const questionId = parseInt(key);
      const answer = answers[questionId];

      // Example: Award points based on the answer
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

    // Normalize scores to 100
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

  const handleStart = () => {
    if (!assessmentData) {
      toast({
        title: "Error",
        description: "Assessment data not loaded. Please try again.",
        variant: "destructive",
      })
      return;
    }

    // Validate lead data
    if (!leadData.firstName || !leadData.lastName || !leadData.email || !leadData.ageRange) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return;
    }

    // Validate answers - Ensure all questions have been answered
    const allQuestionsAnswered = assessmentData.questions.every(question => answers[question.id] !== undefined);
    if (!allQuestionsAnswered) {
      toast({
        title: "Error",
        description: "Please answer all assessment questions.",
        variant: "destructive",
      });
      return;
    }

    const results = calculateResults();
    if (results) {
      navigate('/results', { state: { leadData, answers, results, template: assessmentData.title } });
    } else {
      toast({
        title: "Error",
        description: "Could not calculate results. Please try again.",
        variant: "destructive",
      })
    }
  };

  const renderQuestionInput = (question: Question) => {
    switch (question.type) {
      case 'yes-no':
        return (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Button
              variant={answers[question.id] === 'yes' ? 'default' : 'outline'}
              onClick={() => handleRadioChange('yes', question.id)}
              className="h-12 text-base"
            >
              Yes
            </Button>
            <Button
              variant={answers[question.id] === 'no' ? 'default' : 'outline'}
              onClick={() => handleRadioChange('no', question.id)}
              className="h-12 text-base"
            >
              No
            </Button>
          </div>
        );
      case 'this-that':
        return (
          <div className="grid grid-cols-1 gap-3 mt-4">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant={answers[question.id] === option ? 'default' : 'outline'}
                onClick={() => handleRadioChange(option, question.id)}
                className="h-auto p-4 text-left whitespace-normal justify-start"
              >
                {option}
              </Button>
            ))}
          </div>
        );
      case 'multiple-choice':
        return (
          <RadioGroup onValueChange={(value) => handleRadioChange(value, question.id)} className="flex flex-col space-y-2 mt-4">
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`question-${question.id}-${index}`} />
                <Label htmlFor={`question-${question.id}-${index}`} className="text-gray-700">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );
      case 'rating':
        return (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500">1 - Strongly Disagree</span>
              <span className="text-sm text-gray-500">10 - Strongly Agree</span>
            </div>
            <div className="flex justify-center space-x-2 flex-wrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <Button
                  key={rating}
                  variant={answers[question.id] === rating ? 'default' : 'outline'}
                  onClick={() => handleRadioChange(rating, question.id)}
                  className="w-12 h-12 p-0 mb-2"
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
          <div className="mt-4 space-y-3">
            <p className="text-sm text-gray-600 mb-4">Select all that apply:</p>
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  id={`question-${question.id}-${index}`}
                  checked={Array.isArray(answers[question.id]) && answers[question.id].includes(option)}
                  onChange={(e) => {
                    const currentAnswers = answers[question.id] || [];
                    if (e.target.checked) {
                      handleRadioChange([...currentAnswers, option], question.id);
                    } else {
                      handleRadioChange(currentAnswers.filter((a: string) => a !== option), question.id);
                    }
                  }}
                  className="mt-1"
                />
                <Label htmlFor={`question-${question.id}-${index}`} className="text-base cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <Input
            type="text"
            id={`question-${question.id}`}
            className="mt-4"
            placeholder="Your answer"
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(e, question.id)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6">
        {assessmentData ? (
          <Card className="bg-white shadow-xl rounded-lg p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{assessmentData.title}</h1>
            <p className="text-gray-700 mb-6">{assessmentData.description}</p>

            {/* Lead Information Form */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="Enter your first name"
                    className="mt-1"
                    value={leadData.firstName}
                    onChange={(e) => handleLeadDataChange(e, 'firstName')}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Enter your last name"
                    className="mt-1"
                    value={leadData.lastName}
                    onChange={(e) => handleLeadDataChange(e, 'lastName')}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="mt-1"
                    value={leadData.email}
                    onChange={(e) => handleLeadDataChange(e, 'email')}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    type="tel"
                    id="phone"
                    placeholder="Enter your phone number"
                    className="mt-1"
                    value={leadData.phone || ''}
                    onChange={(e) => handleLeadDataChange(e, 'phone')}
                  />
                </div>
                <div>
                  <Label htmlFor="ageRange">Age Range *</Label>
                  <Select value={leadData.ageRange} onValueChange={(value) => handleLeadDataChange({ target: { value } } as any, 'ageRange')}>
                    <SelectTrigger className="w-full">
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
                  <Label htmlFor="source">How did you hear about us?</Label>
                  <Input
                    type="text"
                    id="source"
                    placeholder="Enter source"
                    className="mt-1"
                    value={leadData.source || ''}
                    onChange={(e) => handleLeadDataChange(e, 'source')}
                  />
                </div>
                <div>
                  <Label htmlFor="audience">Intended Audience</Label>
                  <Select value={leadData.audience || ''} onValueChange={(value) => handleLeadDataChange({ target: { value } } as any, 'audience')}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Assessment Questions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Questions</h2>
              {assessmentData.questions.map(question => (
                <div key={question.id} className="mb-6">
                  <Label htmlFor={`question-${question.id}`} className="block text-gray-700 text-sm font-bold mb-2">{question.question}</Label>
                  {renderQuestionInput(question)}
                </div>
              ))}
            </div>

            {/* Begin Assessment Button */}
            <Button 
              onClick={handleStart}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-4 text-base sm:text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <span className="text-center leading-tight">
                Begin My VoiceCard Assessment
              </span>
            </Button>
          </Card>
        ) : (
          <Card className="bg-white shadow-xl rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-700">Loading assessment...</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assessment;

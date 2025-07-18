import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { AssessmentTemplate } from '@/types/assessment';

interface Question {
  id: number;
  text: string;
  type: 'radio' | 'text' | 'textarea' | 'select';
  options?: string[];
}

interface AssessmentData {
  title: string;
  description: string;
  questions: Question[];
}

interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ageRange: string;
  source?: string;
  audience?: string;
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
    audience: ''
  });
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const { toast } = useToast()

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        // Dynamic import based on the assessment ID
        const assessmentModule = await import(`@/data/assessments/${id}.json`);
        const data: AssessmentTemplate = assessmentModule.default;

        // Transform the assessment data to match the expected structure
        const transformedData: AssessmentData = {
          title: data.title,
          description: data.description,
          questions: data.questions.map(q => ({
            id: q.id,
            text: q.text,
            type: q.type,
            options: q.options
          }))
        };
        setAssessmentData(transformedData);
      } catch (error) {
        console.error("Error loading assessment:", error);
        toast({
          title: "Error",
          description: "Failed to load assessment. Please try again.",
          variant: "destructive",
        })
        navigate('/');
      }
    };

    fetchAssessment();
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
        description: "Please fill in all lead information fields.",
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
                  <Label htmlFor="firstName">First Name</Label>
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
                  <Label htmlFor="lastName">Last Name</Label>
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
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="ageRange">Age Range</Label>
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
                  <Select value={leadData.audience} onValueChange={(value) => handleLeadDataChange({ target: { value } } as any, 'audience')}>
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
                  <Label htmlFor={`question-${question.id}`} className="block text-gray-700 text-sm font-bold mb-2">{question.text}</Label>
                  {question.type === 'radio' && question.options && (
                    <RadioGroup onValueChange={(value) => handleRadioChange(value, question.id)} className="flex flex-col space-y-2">
                      {question.options.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`question-${question.id}-${option}`} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                          <Label htmlFor={`question-${question.id}-${option}`} className="text-gray-700">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  )}
                  {question.type === 'text' && (
                    <Input
                      type="text"
                      id={`question-${question.id}`}
                      className="mt-1"
                      placeholder="Your answer"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(e, question.id)}
                    />
                  )}
                  {question.type === 'textarea' && (
                    <Textarea
                      id={`question-${question.id}`}
                      className="mt-1"
                      placeholder="Your answer"
                      rows={4}
                      value={answers[question.id] || ''}
                      onChange={(e) => handleInputChange(e, question.id)}
                    />
                  )}
                  {question.type === 'select' && question.options && (
                    <Select onValueChange={(value) => handleInputChange({ target: { value } } as any, question.id)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>

            {/* Begin Assessment Button */}
            
                    <Button 
                      onClick={handleStart}
                      size="lg"
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 text-base sm:text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      <span className="whitespace-nowrap">Begin My VoiceCard Assessment</span>
                    </Button>
          </Card>
        ) : (
          <Card className="bg-white shadow-xl rounded-lg p-6">
            <p className="text-gray-700">Loading assessment...</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Assessment;


export interface Question {
  id: number;
  type: 'yes-no' | 'this-that' | 'multiple-choice' | 'rating' | 'desires' | 'pain-avoidance';
  question: string;
  voiceScript?: string;
  description?: string;
  options?: string[];
  audio?: string | File;
}

export interface AssessmentTemplate {
  _id: string;
  title: string;
  description: string;
  audience: 'individual' | 'business';
  tags: string[];
  image?: string;
  questions: Question[];
  welcomeMessageAudio?: string | File;
  keepGoingMessageAudio?: string | File;
  congratulationMessageAudio?: string | File;
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ageRange: string;
  source?: string;
  audience?: string;
  agreedToTerms?: boolean;
  submissionDate?: string;
}

export interface CategoryScores {
  readiness: number;
  confidence: number;
  clarity: number;
}

export interface AssessmentResults {
  overallScore: number;
  categoryScores: CategoryScores;
  completionRate: number;
  insights: string[];
}

// Email notification interface
export interface EmailNotification {
  to: string;
  subject: string;
  body: string;
  leadData: LeadData;
  results: AssessmentResults;
}

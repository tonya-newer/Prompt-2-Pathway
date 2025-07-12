
export interface Question {
  id: number;
  type: 'yes-no' | 'this-that' | 'multiple-choice' | 'rating' | 'desires' | 'pain-avoidance';
  question: string;
  voiceScript?: string;
  options?: string[];
}

export interface AssessmentTemplate {
  id: number;
  title: string;
  description: string;
  audience: string;
  tags: string[];
  image?: string;
  questions: Question[];
}

export interface LeadData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  ageRange: string;
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

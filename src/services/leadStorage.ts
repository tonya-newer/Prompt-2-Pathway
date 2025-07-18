
import { LeadData, AssessmentResults } from '@/types/assessment';

interface StoredLead {
  id: string;
  leadData: LeadData;
  results: AssessmentResults;
  assessmentTitle: string;
  completedAt: string;
  overallScore: number;
  categoryScores: {
    readiness: number;
    confidence: number;
    clarity: number;
  };
  completionRate: number;
  source: string;
  audience: string;
}

export const leadStorageService = {
  // Store a new lead
  storeLead: (leadData: LeadData, results: AssessmentResults, assessmentTitle: string) => {
    const leads = leadStorageService.getLeads();
    
    const newLead: StoredLead = {
      id: Date.now().toString(),
      leadData,
      results,
      assessmentTitle,
      completedAt: new Date().toISOString(),
      overallScore: results.overallScore,
      categoryScores: results.categoryScores,
      completionRate: 100, // Assuming completed assessments are 100%
      source: leadData.source || 'direct',
      audience: leadData.audience || 'individual'
    };

    leads.push(newLead);
    localStorage.setItem('voicecard_leads', JSON.stringify(leads));
    
    console.log('Lead stored successfully:', newLead);
    return newLead;
  },

  // Get all leads
  getLeads: (): StoredLead[] => {
    try {
      const stored = localStorage.getItem('voicecard_leads');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving leads:', error);
      return [];
    }
  },

  // Clear all leads (for testing)
  clearLeads: () => {
    localStorage.removeItem('voicecard_leads');
  },

  // Get lead by ID
  getLeadById: (id: string): StoredLead | null => {
    const leads = leadStorageService.getLeads();
    return leads.find(lead => lead.id === id) || null;
  }
};

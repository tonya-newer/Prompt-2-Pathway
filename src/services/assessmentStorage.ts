
import { AssessmentTemplate } from '@/types/assessment';
import { assessmentTemplates } from '@/data/assessmentTemplates';

class AssessmentStorageService {
  private static instance: AssessmentStorageService;
  private assessments: AssessmentTemplate[] = [];

  static getInstance(): AssessmentStorageService {
    if (!AssessmentStorageService.instance) {
      AssessmentStorageService.instance = new AssessmentStorageService();
    }
    return AssessmentStorageService.instance;
  }

  constructor() {
    this.loadAssessments();
  }

  private loadAssessments(): void {
    try {
      const stored = localStorage.getItem('voicecard-assessments');
      if (stored) {
        const storedAssessments = JSON.parse(stored);
        // Always merge with the latest default templates to ensure new assessments are available
        const defaultIds = assessmentTemplates.map(t => t.id);
        const existingIds = storedAssessments.map((t: AssessmentTemplate) => t.id);
        
        // Add any new default templates that aren't already stored
        const newTemplates = assessmentTemplates.filter(template => !existingIds.includes(template.id));
        
        this.assessments = [...storedAssessments, ...newTemplates];
        this.saveAssessments(); // Save the merged list
      } else {
        // Initialize with default templates
        this.assessments = [...assessmentTemplates];
        this.saveAssessments();
      }
    } catch (error) {
      console.error('Error loading assessments:', error);
      this.assessments = [...assessmentTemplates];
    }
  }

  private saveAssessments(): void {
    try {
      localStorage.setItem('voicecard-assessments', JSON.stringify(this.assessments));
    } catch (error) {
      console.error('Error saving assessments:', error);
    }
  }

  getAllAssessments(): AssessmentTemplate[] {
    return this.assessments;
  }

  getAssessmentById(id: number): AssessmentTemplate | undefined {
    return this.assessments.find(assessment => assessment.id === id);
  }

  createAssessment(assessment: AssessmentTemplate): AssessmentTemplate {
    const newAssessment = {
      ...assessment,
      id: Date.now() // Generate unique ID
    };
    this.assessments.push(newAssessment);
    this.saveAssessments();
    return newAssessment;
  }

  updateAssessment(updatedAssessment: AssessmentTemplate): AssessmentTemplate {
    const index = this.assessments.findIndex(a => a.id === updatedAssessment.id);
    if (index !== -1) {
      this.assessments[index] = updatedAssessment;
      this.saveAssessments();
      return updatedAssessment;
    }
    throw new Error('Assessment not found');
  }

  deleteAssessment(id: number): void {
    this.assessments = this.assessments.filter(a => a.id !== id);
    this.saveAssessments();
  }

  duplicateAssessment(id: number): AssessmentTemplate {
    const original = this.getAssessmentById(id);
    if (!original) {
      throw new Error('Assessment not found');
    }

    const duplicated: AssessmentTemplate = {
      ...original,
      id: Date.now(),
      title: `${original.title} (Copy)`,
      tags: [...original.tags, 'duplicate']
    };

    this.assessments.push(duplicated);
    this.saveAssessments();
    return duplicated;
  }
}

export const assessmentStorageService = AssessmentStorageService.getInstance();

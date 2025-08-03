
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
    // Clear localStorage to force refresh of assessment data
    localStorage.removeItem('prompt2pathway-assessments');
    this.loadAssessments();
  }

  private loadAssessments(): void {
    try {
      const stored = localStorage.getItem('prompt2pathway-assessments');
      if (stored) {
        const storedAssessments = JSON.parse(stored);
        
        // Create a map of template assessments by ID for efficient lookup
        const templateMap = new Map(assessmentTemplates.map(t => [t.id, t]));
        
        // Update stored assessments with current template data, preserving custom user assessments
        const updatedAssessments = storedAssessments.map((stored: AssessmentTemplate) => {
          const template = templateMap.get(stored.id);
          // If this is a template assessment, use the current template data
          // If it's a custom user assessment, keep the stored version
          return template ? template : stored;
        });
        
        // Add any completely new template assessments that weren't in storage
        const existingIds = updatedAssessments.map((t: AssessmentTemplate) => t.id);
        const newTemplates = assessmentTemplates.filter(template => !existingIds.includes(template.id));
        
        this.assessments = [...updatedAssessments, ...newTemplates];
        this.saveAssessments(); // Save the updated list
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
      localStorage.setItem('prompt2pathway-assessments', JSON.stringify(this.assessments));
    } catch (error) {
      console.error('Error saving assessments:', error);
    }
  }

  getAllAssessments(): AssessmentTemplate[] {
    return this.assessments;
  }

  getAssessmentById(id: number | string): AssessmentTemplate | undefined {
    // Handle both string and number IDs for better compatibility
    const assessmentId = typeof id === 'string' ? Number(id) : id;
    const found = this.assessments.find(assessment => assessment.id === assessmentId);
    console.log('Looking for assessment ID:', assessmentId, 'Found:', found ? found.title : 'Not found');
    console.log('Available assessments:', this.assessments.map(a => ({ id: a.id, title: a.title })));
    return found;
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

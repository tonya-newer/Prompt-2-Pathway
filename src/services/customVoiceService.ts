
// Custom voice service for handling uploaded ElevenLabs voice recordings
import { audioManager } from './audioManager';

export class CustomVoiceService {
  private static instance: CustomVoiceService;
  private assessment: any | null = null;

  static getInstance(): CustomVoiceService {
    if (!CustomVoiceService.instance) {
      CustomVoiceService.instance = new CustomVoiceService();
    }
    return CustomVoiceService.instance;
  }

  setAssessment(assessment: any) {
    this.assessment = assessment;
  }

  // Get the appropriate voice file URL based on context
  getVoiceUrl(type: 'welcome' | 'question' | 'congratulations' | 'contact-form', questionId?: number): string | null {
    try {
      switch (type) {
        case 'welcome':
          return import.meta.env.VITE_AUDIO_BASE_URL + this.assessment.welcomeMessageAudio || null;
        case 'congratulations':
          return import.meta.env.VITE_AUDIO_BASE_URL + this.assessment.congratulationMessageAudio || null;
        case 'contact-form':
          return import.meta.env.VITE_AUDIO_BASE_URL + this.assessment.contactMessageAudio || null;
        case 'question':
          if (questionId != null && this.assessment.questions?.[questionId - 1]?.audio) {
            return import.meta.env.VITE_AUDIO_BASE_URL + this.assessment.questions[questionId - 1].audio;
          }
          return null;
        
        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting voice URL:', error);
      return null;
    }
  }

  // Play custom voice file using the single-instance audio manager
  async playVoice(type: 'welcome' | 'question' | 'congratulations' | 'contact-form', questionId?: number, onPlayStart?, onPlayEnded?): Promise<void> {
    const voiceUrl = this.getVoiceUrl(type, questionId);
    
    console.log(`[CustomVoice] 🎵 PLAY REQUEST: ${type} voice (questionId: ${questionId})`);
    console.log(`[CustomVoice] 🎵 Voice URL: ${voiceUrl}`);
    
    if (!voiceUrl) {
      console.warn(`[CustomVoice] ❌ No voice file found for type: ${type}${questionId ? `, question: ${questionId}` : ''}`);
      return;
    }

    try {
      // First check if file exists
      const exists = await this.checkFileExists(voiceUrl);
      if (!exists) {
        console.error(`[CustomVoice] ❌ File not found: ${voiceUrl}`);
        throw new Error(`Voice file not found: ${voiceUrl}`);
      }

      // Use the audio manager to play (ensures only one audio plays at a time)
      console.log(`[CustomVoice] 🎵 Playing via AudioManager: ${voiceUrl}`);
      await audioManager.playAudio(voiceUrl, onPlayStart, onPlayEnded);
      console.log(`[CustomVoice] ✅ Playback completed successfully: ${voiceUrl}`);
      
    } catch (error) {
      console.error(`[CustomVoice] ❌ Failed to play ${voiceUrl}:`, error);
      throw error;
    }
  }

  // Pause current playback
  pauseVoice(): void {
    console.log('[CustomVoice] ⏸ Pausing playback via AudioManager');
    audioManager.pauseAudio();
  }

  // Resume paused playback
  resumeVoice(): void {
    console.log('[CustomVoice] ▶️ Resuming playback via AudioManager');
    audioManager.resumeAudio();
  }

  // Check if file exists with simple HEAD request
  private async checkFileExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Check if a voice file exists
  async checkVoiceExists(type: 'welcome' | 'question' | 'congratulations' | 'contact-form', questionId?: number): Promise<boolean> {
    const voiceUrl = this.getVoiceUrl(type, questionId);
    
    if (!voiceUrl) {
      console.log('[CustomVoice] No voice URL generated');
      return false;
    }

    try {
      const response = await fetch(voiceUrl, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      console.log(`[CustomVoice] Check result for ${voiceUrl}: ${response.ok} (status: ${response.status})`);
      return response.ok;
    } catch (error) {
      console.error('[CustomVoice] Error checking voice file:', voiceUrl, error);
      return false;
    }
  }

  // Stop current playback
  stopVoice(): void {
    console.log('[CustomVoice] 🛑 Requesting stop from AudioManager');
    audioManager.stopAudio();
  }
}

export const customVoiceService = CustomVoiceService.getInstance();

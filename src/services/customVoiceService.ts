
// Custom voice service for handling uploaded ElevenLabs voice recordings
export class CustomVoiceService {
  private static instance: CustomVoiceService;
  private voiceCache: Map<string, string> = new Map();

  static getInstance(): CustomVoiceService {
    if (!CustomVoiceService.instance) {
      CustomVoiceService.instance = new CustomVoiceService();
    }
    return CustomVoiceService.instance;
  }

  // Get the appropriate voice file URL based on context
  getVoiceUrl(type: 'welcome' | 'question' | 'congratulations', questionId?: number): string | null {
    try {
      switch (type) {
        case 'welcome':
          return '/custom-voices/welcome-message.mp3';
        case 'question':
          if (questionId) {
            return `/custom-voices/question-${questionId}.mp3`;
          }
          return '/custom-voices/question-1.mp3';
        case 'congratulations':
          return '/custom-voices/congratulations-message.mp3';
        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting voice URL:', error);
      return null;
    }
  }

  // Play custom voice file
  async playVoice(type: 'welcome' | 'question' | 'congratulations', questionId?: number): Promise<void> {
    const voiceUrl = this.getVoiceUrl(type, questionId);
    
    console.log(`[CustomVoice] Attempting to play ${type} voice: ${voiceUrl} (questionId: ${questionId})`);
    
    if (!voiceUrl) {
      console.warn(`[CustomVoice] No voice file found for type: ${type}${questionId ? `, question: ${questionId}` : ''}`);
      return;
    }

    try {
      // Stop any currently playing audio first
      this.stopVoice();
      
      const audio = new Audio(voiceUrl);
      audio.preload = 'auto';
      
      return new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => {
          console.log(`[CustomVoice] Audio ready to play: ${voiceUrl}`);
          audio.play().then(() => {
            console.log(`[CustomVoice] Audio playback started: ${voiceUrl}`);
            audio.addEventListener('ended', () => {
              console.log(`[CustomVoice] Audio playback ended: ${voiceUrl}`);
              resolve();
            });
          }).catch((playError) => {
            console.error(`[CustomVoice] Audio play failed: ${voiceUrl}`, playError);
            reject(playError);
          });
        });
        
        audio.addEventListener('error', (e) => {
          console.error(`[CustomVoice] Audio error for ${voiceUrl}:`, e);
          reject(new Error(`Failed to play voice file: ${voiceUrl}`));
        });
        
        audio.load();
      });
    } catch (error) {
      console.error(`[CustomVoice] Error playing custom voice ${voiceUrl}:`, error);
      throw error;
    }
  }

  // Check if a voice file exists
  async checkVoiceExists(type: 'welcome' | 'question' | 'congratulations', questionId?: number): Promise<boolean> {
    const voiceUrl = this.getVoiceUrl(type, questionId);
    
    console.log(`[CustomVoice] Checking ${type} voice file: ${voiceUrl} (questionId: ${questionId})`);
    
    if (!voiceUrl) {
      console.log('[CustomVoice] No voice URL generated');
      return false;
    }

    try {
      const response = await fetch(voiceUrl, { method: 'HEAD' });
      console.log(`[CustomVoice] Check result for ${voiceUrl}: ${response.ok} (status: ${response.status})`);
      return response.ok;
    } catch (error) {
      console.error('[CustomVoice] Error checking voice file:', voiceUrl, error);
      return false;
    }
  }

  // Stop current playback
  stopVoice(): void {
    // Stop any currently playing audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  // Get all available question voice files (1-15 based on your upload)
  getAvailableQuestionVoices(): number[] {
    return Array.from({length: 15}, (_, i) => i + 1);
  }
}

export const customVoiceService = CustomVoiceService.getInstance();

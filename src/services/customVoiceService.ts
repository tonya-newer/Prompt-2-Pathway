
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
          return '/custom-voices/default-question.mp3';
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
    
    if (!voiceUrl) {
      console.warn(`No voice file found for type: ${type}`);
      return;
    }

    try {
      const audio = new Audio(voiceUrl);
      audio.preload = 'auto';
      
      return new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', () => {
          audio.play().then(() => {
            audio.addEventListener('ended', () => resolve());
          }).catch(reject);
        });
        
        audio.addEventListener('error', (e) => {
          console.error('Audio playback error:', e);
          reject(new Error(`Failed to play voice file: ${voiceUrl}`));
        });
        
        audio.load();
      });
    } catch (error) {
      console.error('Error playing custom voice:', error);
      throw error;
    }
  }

  // Check if a voice file exists
  async checkVoiceExists(type: 'welcome' | 'question' | 'congratulations', questionId?: number): Promise<boolean> {
    const voiceUrl = this.getVoiceUrl(type, questionId);
    
    if (!voiceUrl) return false;

    try {
      const response = await fetch(voiceUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error checking voice file:', error);
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
}

export const customVoiceService = CustomVoiceService.getInstance();

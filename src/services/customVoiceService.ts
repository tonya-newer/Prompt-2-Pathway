
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
      
      const audio = new Audio();
      
      // Remove CORS for local files - this was causing the format errors
      audio.preload = 'metadata';
      
      // Add proper MIME type handling
      audio.setAttribute('type', 'audio/mpeg');
      
      // Set the source after creating the audio element
      audio.src = voiceUrl;
      
      // Add more detailed error logging
      audio.addEventListener('loadstart', () => {
        console.log(`[CustomVoice] Started loading: ${voiceUrl}`);
      });
      
      audio.addEventListener('loadedmetadata', () => {
        console.log(`[CustomVoice] Metadata loaded for: ${voiceUrl} - Duration: ${audio.duration}s`);
      });
      
      audio.addEventListener('canplay', () => {
        console.log(`[CustomVoice] Can start playing: ${voiceUrl}`);
      });
      
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
          console.error(`[CustomVoice] Audio error details:`, {
            error: audio.error?.message || 'Unknown error',
            errorCode: audio.error?.code || 'No error code',
            networkState: audio.networkState,
            readyState: audio.readyState,
            src: audio.src,
            currentSrc: audio.currentSrc
          });
          
          // Try to provide more specific error information
          if (audio.error) {
            switch (audio.error.code) {
              case 1:
                console.error('[CustomVoice] MEDIA_ERR_ABORTED - The user aborted the loading');
                break;
              case 2:
                console.error('[CustomVoice] MEDIA_ERR_NETWORK - A network error occurred');
                break;
              case 3:
                console.error('[CustomVoice] MEDIA_ERR_DECODE - Error occurred when decoding');
                break;
              case 4:
                console.error('[CustomVoice] MEDIA_ERR_SRC_NOT_SUPPORTED - Audio format not supported');
                break;
              default:
                console.error('[CustomVoice] Unknown media error');
            }
          }
          
          reject(new Error(`Failed to play voice file: ${voiceUrl} - Error code: ${audio.error?.code}`));
        });
        
        // Try to load the audio
        audio.load();
        
        // Add a timeout to catch hanging loads
        setTimeout(() => {
          if (audio.readyState === 0) {
            console.error(`[CustomVoice] Audio load timeout for: ${voiceUrl}`);
            reject(new Error(`Audio load timeout: ${voiceUrl}`));
          }
        }, 10000);
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

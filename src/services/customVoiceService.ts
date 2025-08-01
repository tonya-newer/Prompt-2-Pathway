
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
            return `/custom-voices/question-${questionId}.wav`;
          }
          return '/custom-voices/question-1.wav';
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

  // Play custom voice file with multi-format support
  async playVoice(type: 'welcome' | 'question' | 'congratulations', questionId?: number): Promise<void> {
    const baseUrl = this.getVoiceUrl(type, questionId);
    
    console.log(`[CustomVoice] Attempting to play ${type} voice (questionId: ${questionId})`);
    
    if (!baseUrl) {
      console.warn(`[CustomVoice] No voice file found for type: ${type}${questionId ? `, question: ${questionId}` : ''}`);
      return;
    }

    // Try multiple formats: WAV first for questions, MP3 for others
    const formats = type === 'question' 
      ? [{ url: baseUrl, type: 'audio/wav' }]  // Questions use WAV only
      : [{ url: baseUrl, type: 'audio/mpeg' }]; // Welcome/congratulations use MP3

    for (const format of formats) {
      try {
        console.log(`[CustomVoice] Trying format: ${format.url}`);
        
        // First check if file exists
        const exists = await this.checkFileExists(format.url);
        if (!exists) {
          console.log(`[CustomVoice] File not found: ${format.url}`);
          continue;
        }

        // Try to play this format
        await this.playAudioFile(format.url, format.type);
        return; // Success, exit
      } catch (error) {
        console.warn(`[CustomVoice] Failed to play ${format.url}:`, error);
        continue; // Try next format
      }
    }

    throw new Error(`[CustomVoice] All audio formats failed for ${baseUrl}`);
  }

  // Check if file exists with better error handling
  private async checkFileExists(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  // Play a specific audio file with enhanced error handling
  private async playAudioFile(url: string, mimeType: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      // Configure audio element for maximum compatibility
      audio.preload = 'auto';
      audio.crossOrigin = null; // Remove CORS for local files
      
      // Set source and MIME type
      audio.src = url;
      if (mimeType) {
        audio.setAttribute('type', mimeType);
      }
      
      // Add detailed logging
      audio.addEventListener('loadstart', () => {
        console.log(`[CustomVoice] Started loading: ${url}`);
        console.log(`[CustomVoice] Audio details:`, {
          preload: audio.preload,
          type: audio.getAttribute('type'),
          mimeType
        });
      });
      
      audio.addEventListener('loadedmetadata', () => {
        console.log(`[CustomVoice] Metadata loaded: ${url} - Duration: ${audio.duration}s`);
      });
      
      audio.addEventListener('canplaythrough', () => {
        console.log(`[CustomVoice] Ready to play: ${url}`);
        audio.play().then(() => {
          console.log(`[CustomVoice] Playback started: ${url}`);
          
          audio.addEventListener('ended', () => {
            console.log(`[CustomVoice] Playback ended: ${url}`);
            resolve();
          });
        }).catch((playError) => {
          console.error(`[CustomVoice] Play failed: ${url}`, playError);
          reject(playError);
        });
      });
      
      audio.addEventListener('error', (e) => {
        console.error(`[CustomVoice] Audio error for ${url}:`, e);
        
        const errorDetails = {
          error: audio.error?.message || 'Unknown error',
          errorCode: audio.error?.code || 'No error code',
          networkState: audio.networkState,
          readyState: audio.readyState,
          src: audio.src,
          currentSrc: audio.currentSrc,
          mimeType
        };
        
        console.error(`[CustomVoice] Error details:`, errorDetails);
        
        // Provide specific error information
        if (audio.error) {
          switch (audio.error.code) {
            case 1:
              console.error('[CustomVoice] MEDIA_ERR_ABORTED - Loading aborted');
              break;
            case 2:
              console.error('[CustomVoice] MEDIA_ERR_NETWORK - Network error');
              break;
            case 3:
              console.error('[CustomVoice] MEDIA_ERR_DECODE - Decoding error');
              break;
            case 4:
              console.error('[CustomVoice] MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported');
              break;
            default:
              console.error('[CustomVoice] Unknown media error');
          }
        }
        
        reject(new Error(`Audio playback failed: ${url} (Error code: ${audio.error?.code})`));
      });
      
      // Set a timeout for loading
      const loadTimeout = setTimeout(() => {
        if (audio.readyState === 0) {
          console.error(`[CustomVoice] Load timeout: ${url}`);
          reject(new Error(`Audio load timeout: ${url}`));
        }
      }, 10000);
      
      // Clear timeout when loading starts progressing
      audio.addEventListener('loadstart', () => {
        clearTimeout(loadTimeout);
      });
      
      // Start loading
      audio.load();
    });
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

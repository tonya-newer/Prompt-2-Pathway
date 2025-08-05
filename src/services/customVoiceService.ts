
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
          return `/custom-voices/welcome-message.mp3`;
        case 'question':
          if (questionId) {
            return `/custom-voices/question-${questionId}.wav`;
          }
          return '/custom-voices/question-1.wav';
        case 'congratulations':
          return '/custom-voices/congratulations-message.wav';
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

    // Determine format based on file extension
    const formats = baseUrl.includes('.mp3')
      ? [{ url: baseUrl, type: 'audio/mpeg' }]
      : [{ url: baseUrl, type: 'audio/wav' }];

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

  // Play a specific audio file with proper MIME type handling
  private async playAudioFile(url: string, mimeType: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`[CustomVoice] Creating audio element for: ${url} (MIME: ${mimeType})`);
      
      const audio = new Audio();
      
      // Configure for maximum browser compatibility
      audio.preload = 'auto';
      audio.crossOrigin = null;
      
      // Set source directly - NO cache busting to avoid MIME detection issues
      audio.src = url;
      
      // Success handlers
      audio.addEventListener('canplaythrough', () => {
        console.log(`[CustomVoice] Audio ready to play: ${url}`);
        audio.play().then(() => {
          console.log(`[CustomVoice] Playback started successfully: ${url}`);
        }).catch((playError) => {
          console.error(`[CustomVoice] Play() failed: ${url}`, playError);
          reject(playError);
        });
      });
      
      audio.addEventListener('ended', () => {
        console.log(`[CustomVoice] Playback completed: ${url}`);
        resolve();
      });
      
      audio.addEventListener('error', (e) => {
        const error = audio.error;
        console.error(`[CustomVoice] Audio error for ${url}:`, {
          message: error?.message || 'Unknown error',
          code: error?.code || 'No code',
          networkState: audio.networkState,
          readyState: audio.readyState
        });
        
        reject(new Error(`Audio playback failed: ${url} (Error: ${error?.code})`));
      });
      
      // Set timeout for loading
      const timeout = setTimeout(() => {
        console.error(`[CustomVoice] Load timeout for: ${url}`);
        reject(new Error(`Audio load timeout: ${url}`));
      }, 5000);
      
      audio.addEventListener('loadstart', () => {
        clearTimeout(timeout);
        console.log(`[CustomVoice] Started loading: ${url}`);
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
    console.log('[CustomVoice] Stopping all audio playback');
    // Stop any currently playing audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      if (!audio.paused) {
        console.log('[CustomVoice] Stopping audio element:', audio.src);
        audio.pause();
        audio.currentTime = 0;
      }
      // Remove the audio element to fully stop playback
      audio.remove();
    });
    
    // Clear any pending timeouts or intervals that might be creating new audio
    this.voiceCache.clear();
  }

  // Get all available question voice files (1-15 based on your upload)
  getAvailableQuestionVoices(): number[] {
    return Array.from({length: 15}, (_, i) => i + 1);
  }
}

export const customVoiceService = CustomVoiceService.getInstance();

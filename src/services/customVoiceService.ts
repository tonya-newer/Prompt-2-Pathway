
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
  getVoiceUrl(type: 'welcome' | 'question' | 'congratulations' | 'contact-form', questionId?: number): string | null {
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
        case 'contact-form':
          return '/custom-voices/contact-form.wav';
        default:
          return null;
      }
    } catch (error) {
      console.error('Error getting voice URL:', error);
      return null;
    }
  }

  // Play custom voice file with multi-format support
  async playVoice(type: 'welcome' | 'question' | 'congratulations' | 'contact-form', questionId?: number): Promise<void> {
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
      
      // Essential settings for audio playback
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.volume = 1.0;
      audio.muted = false;
      
      // Set source directly
      audio.src = url;
      
      // Set up event listeners before loading
      const cleanup = () => {
        audio.removeEventListener('canplaythrough', onCanPlay);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadeddata', onLoadedData);
        audio.pause();
        audio.currentTime = 0;
        audio.remove();
      };

      const onLoadedData = () => {
        console.log(`[CustomVoice] Audio data loaded: ${url}, duration: ${audio.duration}s`);
      };

      const onCanPlay = async () => {
        console.log(`[CustomVoice] Audio ready to play: ${url}, readyState: ${audio.readyState}`);
        
        try {
          // Ensure audio is not muted and volume is set
          audio.muted = false;
          audio.volume = 1.0;
          
          // Force play with user gesture context
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log(`[CustomVoice] Playback started successfully: ${url}`);
          } else {
            console.log(`[CustomVoice] Play() returned undefined for: ${url}`);
          }
        } catch (playError) {
          console.error(`[CustomVoice] Play() failed: ${url}`, playError);
          
          // Try to handle autoplay restrictions
          if (playError.name === 'NotAllowedError') {
            console.log(`[CustomVoice] Autoplay blocked for: ${url}. User interaction required.`);
            // Don't reject immediately, let the user try manually
            return;
          }
          
          cleanup();
          reject(playError);
        }
      };
      
      const onEnded = () => {
        console.log(`[CustomVoice] Playback completed: ${url}`);
        cleanup();
        resolve();
      };
      
      const onError = (e: Event) => {
        const error = audio.error;
        console.error(`[CustomVoice] Audio error for ${url}:`, {
          message: error?.message || 'Unknown error',
          code: error?.code || 'No code',
          networkState: audio.networkState,
          readyState: audio.readyState,
          currentSrc: audio.currentSrc
        });
        cleanup();
        reject(new Error(`Audio playback failed: ${url} (Error code: ${error?.code}, Message: ${error?.message})`));
      };
      
      // Add event listeners
      audio.addEventListener('loadeddata', onLoadedData);
      audio.addEventListener('canplaythrough', onCanPlay);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);
      
      // Set timeout for loading
      const timeout = setTimeout(() => {
        console.error(`[CustomVoice] Load timeout for: ${url}`);
        cleanup();
        reject(new Error(`Audio load timeout: ${url}`));
      }, 15000); // Increased timeout to 15 seconds
      
      // Clear timeout when audio starts loading
      audio.addEventListener('loadstart', () => {
        console.log(`[CustomVoice] Started loading: ${url}`);
        clearTimeout(timeout);
      });
      
      // Start loading
      console.log(`[CustomVoice] Loading audio: ${url}`);
      audio.load();
    });
  }

  // Check if a voice file exists
  async checkVoiceExists(type: 'welcome' | 'question' | 'congratulations' | 'contact-form', questionId?: number): Promise<boolean> {
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

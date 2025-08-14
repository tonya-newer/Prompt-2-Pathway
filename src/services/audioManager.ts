// Single-instance audio manager to prevent multiple simultaneous playbacks
export class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement = new Audio();
  private isPlaying: boolean = false;

  constructor() {
    this.currentAudio.preload = 'auto';
    this.currentAudio.volume = 1.0;
    this.currentAudio.muted = false;
    this.currentAudio.crossOrigin = 'anonymous';
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Stop any currently playing audio completely
  stopAudio(): void {
    if (this.currentAudio) {
      console.log('[AudioManager] 🛑 Stopping current audio:', this.currentAudio.src);
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;

      this.currentAudio.onended = null;
      this.currentAudio.oncanplaythrough = null;
      this.currentAudio.onerror = null;
    }

    this.isPlaying = false;
  }

  // Pause without resetting position
  pauseAudio(): void {
    if (this.currentAudio && !this.currentAudio.paused) {
      console.log('[AudioManager] ⏸ Pausing audio:', this.currentAudio.src);
      this.currentAudio.pause();
      this.isPlaying = false;
    }
  }

  // Resume if paused
  resumeAudio(): void {
    if (this.currentAudio && this.currentAudio.paused) {
      console.log('[AudioManager] ▶️ Resuming audio:', this.currentAudio.src);
      this.currentAudio.play().catch(err => {
        console.error('[AudioManager] ❌ Failed to resume audio', err);
      });
      this.isPlaying = true;
    }
  }

  // Play a single audio file - ensures only one can play at a time
  async playAudio(url: string, onPlayStart?: () => void, onPlayEnded?: () => void): Promise<void> {
    console.log(`[AudioManager] 🎵 PLAY REQUEST: ${url}`);
    
    // Stop any existing audio first
    this.stopAudio();

    return new Promise((resolve, reject) => {
      console.log(`[AudioManager] 🎵 Creating new audio element for: ${url}`);

      this.isPlaying = true;

      this.currentAudio.src = url;

      // Start loading
      console.log(`[AudioManager] 🔄 Loading audio: ${url}`);
      this.currentAudio.load();

      this.currentAudio.oncanplaythrough = async () => {
        console.log("[AudioManager] ✅ Can play through - Starting playback");
        
        try {      
          console.log(`[AudioManager] 🎵 Attempting to play...`);
          await this.currentAudio.play();
          
          if (onPlayStart) {
            onPlayStart();
            console.log(`[AudioManager] 🔊 Playback started successfully: ${url}`);
          }
        } catch (playError) {
          console.error('[AudioManager] ❌ Play failed', {error: playError});
        }
      };
    
      this.currentAudio.onended = () => {
        console.log(`[AudioManager] 🏁 Playback completed: ${url}`);
        if (onPlayEnded) onPlayEnded();    
        this.isPlaying = false;
      };
    
      this.currentAudio.onerror = (e: Event) => {
        const error = this.currentAudio.error;
        reject(new Error(`Audio playback failed: ${url} (Error code: ${error?.code})`));      
        this.isPlaying = false;
      };

      // // Timeout for loading
      // const timeout = setTimeout(() => {
      //   console.error(`[AudioManager] ⏰ Load timeout: ${url}`);
      //   cleanup();
      //   reject(new Error(`Audio load timeout: ${url}`));
      // }, 10000);

      // // Clear timeout when loading starts
      // audio.addEventListener('loadstart', () => {
      //   clearTimeout(timeout);
      // });
    });
  }

  // Check if currently playing
  get playing(): boolean {
    return this.isPlaying;
  }
}

export const audioManager = AudioManager.getInstance();
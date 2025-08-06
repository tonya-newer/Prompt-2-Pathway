// Single-instance audio manager to prevent multiple simultaneous playbacks
export class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Stop any currently playing audio completely
  stopAll(): void {
    console.log('[AudioManager] 🛑 STOP ALL AUDIO');
    
    if (this.currentAudio) {
      console.log('[AudioManager] 🛑 Stopping current audio:', this.currentAudio.src);
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.remove();
      this.currentAudio = null;
    }

    // Also stop any other audio elements that might exist
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach((audio, index) => {
      console.log(`[AudioManager] 🛑 Removing audio element ${index}:`, audio.src);
      audio.pause();
      audio.currentTime = 0;
      audio.remove();
    });

    this.isPlaying = false;
    console.log('[AudioManager] 🛑 All audio stopped');
  }

  // Play a single audio file - ensures only one can play at a time
  async playAudio(url: string): Promise<void> {
    console.log(`[AudioManager] 🎵 PLAY REQUEST: ${url}`);
    
    // Stop any existing audio first
    this.stopAll();

    return new Promise((resolve, reject) => {
      console.log(`[AudioManager] 🎵 Creating new audio element for: ${url}`);
      
      const audio = new Audio();
      this.currentAudio = audio;
      this.isPlaying = true;

      // Essential audio settings
      audio.preload = 'auto';
      audio.volume = 1.0;
      audio.muted = false;
      audio.crossOrigin = 'anonymous';
      audio.src = url;

      let resolved = false;

      const cleanup = () => {
        if (resolved) return;
        resolved = true;
        
        audio.removeEventListener('loadeddata', onLoadedData);
        audio.removeEventListener('canplaythrough', onCanPlayThrough);
        audio.removeEventListener('ended', onEnded);
        audio.removeEventListener('error', onError);
        audio.removeEventListener('loadstart', onLoadStart);
        
        this.isPlaying = false;
        if (this.currentAudio === audio) {
          this.currentAudio = null;
        }
      };

      const onLoadStart = () => {
        console.log(`[AudioManager] 📥 Load started: ${url}`);
      };

      const onLoadedData = () => {
        console.log(`[AudioManager] 📊 Audio loaded - Duration: ${audio.duration}s, Ready state: ${audio.readyState}`);
      };

      const onCanPlayThrough = async () => {
        console.log(`[AudioManager] ✅ Can play through - Starting playback: ${url}`);
        
        try {
          // Ensure settings are correct
          audio.muted = false;
          audio.volume = 1.0;
          
          const playPromise = audio.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log(`[AudioManager] 🔊 Playback started successfully: ${url}`);
          }
        } catch (playError) {
          console.error(`[AudioManager] ❌ Play failed: ${url}`, playError);
          cleanup();
          reject(playError);
        }
      };

      const onEnded = () => {
        console.log(`[AudioManager] 🏁 Playback completed: ${url}`);
        console.log(`[AudioManager] 🏁 Final stats - Duration: ${audio.duration}s, Played to: ${audio.currentTime}s`);
        cleanup();
        resolve();
      };

      const onError = (e: Event) => {
        const error = audio.error;
        console.error(`[AudioManager] ❌ Audio error: ${url}`, {
          code: error?.code,
          message: error?.message,
          networkState: audio.networkState,
          readyState: audio.readyState,
          currentSrc: audio.currentSrc
        });
        cleanup();
        reject(new Error(`Audio playback failed: ${url}`));
      };

      // Add event listeners
      audio.addEventListener('loadstart', onLoadStart);
      audio.addEventListener('loadeddata', onLoadedData);
      audio.addEventListener('canplaythrough', onCanPlayThrough);
      audio.addEventListener('ended', onEnded);
      audio.addEventListener('error', onError);

      // Timeout for loading
      const timeout = setTimeout(() => {
        console.error(`[AudioManager] ⏰ Load timeout: ${url}`);
        cleanup();
        reject(new Error(`Audio load timeout: ${url}`));
      }, 10000);

      // Clear timeout when loading starts
      audio.addEventListener('loadstart', () => {
        clearTimeout(timeout);
      });

      // Start loading
      console.log(`[AudioManager] 🔄 Loading audio: ${url}`);
      audio.load();
    });
  }

  // Check if currently playing
  get playing(): boolean {
    return this.isPlaying;
  }
}

export const audioManager = AudioManager.getInstance();
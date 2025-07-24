
// Native browser speech synthesis service
export interface SpeechOptions {
  text: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export class NativeSpeechService {
  private synthesis: SpeechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.loadVoices();
  }

  private loadVoices = () => {
    const voices = this.synthesis.getVoices();
    this.voices = voices.filter(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('woman') ||
       voice.name.includes('Samantha') ||
       voice.name.includes('Karen') ||
       voice.name.includes('Zira') ||
       voice.name.includes('Google UK English Female'))
    );
    
    // If no specific female voices found, get all English voices
    if (this.voices.length === 0) {
      this.voices = voices.filter(voice => voice.lang.startsWith('en'));
    }
    
    // Set default voice (prefer first female voice)
    this.selectedVoice = this.voices[0] || voices[0] || null;
  };

  public getAvailableVoices(): { name: string; lang: string }[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices.map(voice => ({
      name: voice.name,
      lang: voice.lang
    }));
  }

  public setVoice(voiceName: string): boolean {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.selectedVoice = voice;
      return true;
    }
    return false;
  }

  public speak(options: SpeechOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Stop any current speech
      this.stop();

      const utterance = new SpeechSynthesisUtterance(options.text);
      
      // Set voice
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      
      // Set parameters
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Set up event listeners
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech error: ${event.error}`));
      };

      this.currentUtterance = utterance;
      this.synthesis.speak(utterance);
    });
  }

  public stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
    this.currentUtterance = null;
  }

  public pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  public resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  public isPlaying(): boolean {
    return this.synthesis.speaking && !this.synthesis.paused;
  }

  public isPaused(): boolean {
    return this.synthesis.paused;
  }
}

export const nativeSpeech = new NativeSpeechService();

// Wait for voices to load
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    nativeSpeech.getAvailableVoices();
  };
}

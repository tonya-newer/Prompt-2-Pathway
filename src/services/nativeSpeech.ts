
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
    const allVoices = this.synthesis.getVoices();
    
    // Priority order for high-quality female voices
    const preferredVoices = [
      'Samantha',           // macOS/iOS - natural and engaging
      'Microsoft Zira',     // Windows - clear and business-friendly
      'Microsoft Zira - English (United States)',
      'Zira',
      'Karen',
      'Victoria',
      'Allison',
      'Susan',
      'Google US English',
      'Google US English Female'
    ];

    // Filter to US English voices only
    const usEnglishVoices = allVoices.filter(voice => 
      voice.lang.includes('en-US') || voice.lang.includes('en_US')
    );

    console.log('Available US English voices:', usEnglishVoices.map(v => `${v.name} - ${v.lang}`));

    // Find the best available voice in priority order
    let bestVoice = null;
    for (const preferredName of preferredVoices) {
      bestVoice = usEnglishVoices.find(voice => 
        voice.name.toLowerCase().includes(preferredName.toLowerCase())
      );
      if (bestVoice) {
        console.log(`Selected preferred voice: ${bestVoice.name} - ${bestVoice.lang}`);
        break;
      }
    }

    // If no preferred voice found, look for any female voice
    if (!bestVoice) {
      bestVoice = usEnglishVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('woman')
      );
    }

    // Final fallback to first US English voice
    if (!bestVoice && usEnglishVoices.length > 0) {
      bestVoice = usEnglishVoices[0];
    }

    this.voices = usEnglishVoices;
    this.selectedVoice = bestVoice;
    
    if (this.selectedVoice) {
      console.log(`Voice selected: ${this.selectedVoice.name} - ${this.selectedVoice.lang}`);
    } else {
      console.log('No suitable voice found');
    }
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

  public getSelectedVoice(): string | null {
    return this.selectedVoice ? this.selectedVoice.name : null;
  }

  public setVoice(voiceName: string): boolean {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.selectedVoice = voice;
      console.log(`Voice changed to: ${voice.name}`);
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
        console.log(`Speaking with voice: ${this.selectedVoice.name}`);
      } else {
        console.log('No voice selected, using default');
      }
      
      // Set parameters for natural speech
      utterance.rate = options.rate || 0.85;  // Slightly slower for clarity
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 1.0;

      // Set up event listeners
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };
      
      utterance.onerror = (event) => {
        this.currentUtterance = null;
        console.error('Speech error:', event.error);
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

// Wait for voices to load and reload voice selection
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = () => {
    console.log('Voices changed, reloading...');
    nativeSpeech.getAvailableVoices();
  };
}

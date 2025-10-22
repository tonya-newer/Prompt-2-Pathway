
// ElevenLabs service for voice generation
const ELEVENLABS_API_KEY = 'sk_1b1fabd8123ff50b52bb77acc7b28cfb3de3eea18dee4f7d';

// Your cloned voice ID - Sarah voice as placeholder
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL';

export interface VoiceGenerationOptions {
  text: string;
  model?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export const generateVoiceAudio = async (options: VoiceGenerationOptions): Promise<ArrayBuffer> => {
  try {
    console.log('Starting ElevenLabs voice generation for text:', options.text.substring(0, 100) + '...');
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: options.text,
        model_id: options.model || 'eleven_multilingual_v2',
        voice_settings: options.voice_settings || {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.2,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', response.status, errorText);
      throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
    }

    console.log('ElevenLabs voice generation successful');
    return await response.arrayBuffer();
  } catch (error) {
    console.error('Error generating voice audio:', error);
    throw error;
  }
};

export const createAudioFromText = async (text: string): Promise<string> => {
  try {
    console.log('Creating audio from text:', text.substring(0, 50) + '...');
    
    // First try ElevenLabs
    try {
      const audioBuffer = await generateVoiceAudio({ text });
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);
      console.log('ElevenLabs audio URL created successfully');
      return audioUrl;
    } catch (elevenlabsError) {
      console.error('ElevenLabs failed, using fallback:', elevenlabsError);
      
      // Fallback to static audio file
      const fallbackUrl = '/custom-voice.mp3';
      
      // Test if fallback file exists
      try {
        const testResponse = await fetch(fallbackUrl, { method: 'HEAD' });
        if (testResponse.ok) {
          console.log('Using fallback audio file');
          return fallbackUrl;
        }
      } catch (fallbackError) {
        console.error('Fallback audio file not found:', fallbackError);
      }
      
      // If all else fails, return empty string (will be handled by components)
      throw new Error('No audio source available');
    }
  } catch (error) {
    console.error('Error creating audio from text:', error);
    throw error;
  }
};

// Test if audio can be played (for debugging)
export const testAudioPlayback = (audioUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener('canplaythrough', () => resolve(true));
    audio.addEventListener('error', () => resolve(false));
    audio.load();
  });
};

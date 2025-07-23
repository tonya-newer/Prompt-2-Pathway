
import { ElevenLabsApi } from '@11labs/client';

const ELEVENLABS_API_KEY = 'sk_1b1fabd8123ff50b52bb77acc7b28cfb3de3eea18dee4f7d';

// Initialize ElevenLabs client
const client = new ElevenLabsApi({
  apiKey: ELEVENLABS_API_KEY,
});

// Your cloned voice ID - we'll use a default voice for now, but you can replace this with your actual voice ID
const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah voice as placeholder

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
    const response = await client.textToSpeech.convert(VOICE_ID, {
      text: options.text,
      model_id: options.model || 'eleven_multilingual_v2',
      voice_settings: options.voice_settings || {
        stability: 0.5,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    });

    return response;
  } catch (error) {
    console.error('Error generating voice audio:', error);
    throw error;
  }
};

export const createAudioFromText = async (text: string): Promise<string> => {
  try {
    const audioBuffer = await generateVoiceAudio({ text });
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating audio from text:', error);
    // Fallback to original static audio if ElevenLabs fails
    return '/custom-voice.mp3';
  }
};

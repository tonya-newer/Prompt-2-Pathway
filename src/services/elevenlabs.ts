
// ElevenLabs service for voice generation
const ELEVENLABS_API_KEY = 'sk_1b1fabd8123ff50b52bb77acc7b28cfb3de3eea18dee4f7d';

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
    console.log('Starting ElevenLabs voice generation for text:', options.text.substring(0, 100) + '...');
    
    // Direct API call to ElevenLabs REST API
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
    const audioBuffer = await generateVoiceAudio({ text });
    const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);
    console.log('Audio URL created successfully');
    return audioUrl;
  } catch (error) {
    console.error('Error creating audio from text:', error);
    // Fallback to original static audio if ElevenLabs fails
    return '/custom-voice.mp3';
  }
};

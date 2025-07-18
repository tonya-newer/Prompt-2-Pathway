
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Headphones } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface VoicePlayerProps {
  text: string;
  autoPlay?: boolean;
  className?: string;
}

export const VoicePlayer = ({ text, autoPlay = false, className = '' }: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('elevenlabs-api-key') || '');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Your specific voice configuration
  const VOICE_ID = 'rhKGiHCLeAC5KPBEZiUq'; // Apple – Quirky & Relatable
  const MODEL_ID = 'eleven_multilingual_v2';

  const saveApiKey = (key: string) => {
    localStorage.setItem('elevenlabs-api-key', key);
    setApiKey(key);
  };

  const generateSpeech = async () => {
    if (!apiKey || apiKey.trim() === '') {
      const userKey = prompt('Please enter your ElevenLabs API key:');
      if (userKey) {
        saveApiKey(userKey);
        return generateSpeech();
      } else {
        return speakWithBrowserAPI();
      }
    }

    try {
      setIsLoading(true);
      console.log('Generating speech with ElevenLabs for voice:', VOICE_ID);
      
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: MODEL_ID,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert('Invalid API key. Please check your ElevenLabs API key.');
          localStorage.removeItem('elevenlabs-api-key');
          setApiKey('');
          return;
        }
        throw new Error(`ElevenLabs API request failed: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        await audioRef.current.play();
      }
    } catch (error) {
      console.error('ElevenLabs error, falling back to browser speech:', error);
      speakWithBrowserAPI();
    } finally {
      setIsLoading(false);
    }
  };

  const speakWithBrowserAPI = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = isMuted ? 0 : 1;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Alex') || 
      voice.name.includes('Karen') ||
      voice.lang === 'en-US'
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    generateSpeech();
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    speechSynthesis.cancel();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : 1;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.onplay = () => setIsPlaying(true);
      audio.onpause = () => setIsPlaying(false);
      audio.onended = () => setIsPlaying(false);
    }
  }, []);

  return (
    <Card className={`p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* API Key Management */}
        {!apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800 mb-2">Enter your ElevenLabs API key for premium voice experience:</p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Enter API key..."
                className="flex-1 text-sm p-2 border rounded"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      saveApiKey(target.value.trim());
                    }
                  }
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  const input = document.querySelector('input[type="password"]') as HTMLInputElement;
                  if (input?.value.trim()) {
                    saveApiKey(input.value.trim());
                  }
                }}
              >
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Voice Guide Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button
              variant="default"
              size="lg"
              onClick={isPlaying ? handleStop : handlePlay}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto text-sm sm:text-base"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : isPlaying ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              <span className="whitespace-nowrap">
                {isLoading ? 'Loading...' : isPlaying ? 'Pause Audio' : 'Play Audio'}
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={toggleMute}
              className="hover:bg-blue-100 border-blue-300 p-2 sm:p-3 flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-gray-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-blue-600" />
              )}
            </Button>
          </div>
          
          {/* Voice Status */}
          <div className="flex-1 w-full">
            <div className="flex items-center mb-2">
              <Headphones className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
              <p className="text-sm sm:text-base font-bold text-blue-900">
                {apiKey ? 'Premium Voice Ready' : 'Voice Guide Ready'}
              </p>
            </div>
            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
              {text.length > 80 ? `${text.substring(0, 80)}...` : text}
            </p>
          </div>
          
          {/* Audio Visualizer */}
          {isPlaying && (
            <div className="flex space-x-1 flex-shrink-0">
              <div className="w-1 h-3 sm:w-2 sm:h-4 bg-blue-500 animate-pulse rounded-full"></div>
              <div className="w-1 h-4 sm:w-2 sm:h-6 bg-blue-500 animate-pulse delay-75 rounded-full"></div>
              <div className="w-1 h-3 sm:w-2 sm:h-4 bg-blue-500 animate-pulse delay-150 rounded-full"></div>
            </div>
          )}
        </div>
      </div>
      
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
};

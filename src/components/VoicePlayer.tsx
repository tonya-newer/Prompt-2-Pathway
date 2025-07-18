
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ELEVENLABS_API_KEY = 'your-api-key-here'; // You'll need to add your API key
  const VOICE_ID = 'rhKGiHCLeAC5KPBEZiUq'; // Apple – Quirky & Relatable

  const generateSpeech = async () => {
    if (!ELEVENLABS_API_KEY || ELEVENLABS_API_KEY === 'your-api-key-here') {
      // Fallback to browser speech synthesis
      return speakWithBrowserAPI();
    }

    try {
      setIsLoading(true);
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('ElevenLabs API request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
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
    if (ELEVENLABS_API_KEY && ELEVENLABS_API_KEY !== 'your-api-key-here') {
      generateSpeech();
    } else {
      speakWithBrowserAPI();
    }
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
    <Card className={`p-4 md:p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Button
            variant="default"
            size="lg"
            onClick={isPlaying ? handleStop : handlePlay}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 sm:px-6 sm:py-3 w-full sm:w-auto"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : isPlaying ? (
              <Pause className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            ) : (
              <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            )}
            <span className="text-sm sm:text-base">
              {isLoading ? 'Loading...' : isPlaying ? 'Pause Audio' : 'Play Audio'}
            </span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={toggleMute}
            className="hover:bg-blue-100 border-blue-300 p-2 sm:p-3"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            ) : (
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            )}
          </Button>
        </div>
        
        <div className="flex-1 w-full">
          <div className="flex items-center mb-2">
            <Headphones className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2" />
            <p className="text-base sm:text-lg font-bold text-blue-900">Voice Guide Ready</p>
          </div>
          <p className="text-xs sm:text-sm text-blue-700 leading-relaxed line-clamp-2">
            {text.length > 100 ? `${text.substring(0, 100)}...` : text}
          </p>
        </div>
        
        {isPlaying && (
          <div className="flex space-x-1">
            <div className="w-1 h-4 sm:w-2 sm:h-6 bg-blue-500 animate-pulse rounded-full"></div>
            <div className="w-1 h-6 sm:w-2 sm:h-8 bg-blue-500 animate-pulse delay-75 rounded-full"></div>
            <div className="w-1 h-4 sm:w-2 sm:h-6 bg-blue-500 animate-pulse delay-150 rounded-full"></div>
          </div>
        )}
      </div>
      
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
};

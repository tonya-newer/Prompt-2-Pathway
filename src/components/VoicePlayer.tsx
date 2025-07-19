
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Headphones, Sparkles } from 'lucide-react';
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

  // Get API key from localStorage (set in admin dashboard)
  const getApiKey = () => localStorage.getItem('elevenlabs-api-key') || '';
  
  // Voice configuration - ONLY Apple - Quirky & Relatable
  const VOICE_ID = '9BWtsMINqrJLrRacOk9x'; // Aria - Apple - Quirky & Relatable
  const MODEL_ID = 'eleven_multilingual_v2';

  const generateSpeech = async () => {
    const apiKey = getApiKey();
    
    if (!apiKey || apiKey.trim() === '') {
      console.log('No ElevenLabs API key found, using browser speech synthesis');
      return speakWithBrowserAPI();
    }

    try {
      setIsLoading(true);
      console.log('Generating premium voice with ElevenLabs - Apple Quirky & Relatable:', VOICE_ID);
      
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
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.7,
            use_speaker_boost: true
          },
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Invalid ElevenLabs API key, falling back to browser voice');
          return speakWithBrowserAPI();
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
      console.error('ElevenLabs error, falling back to browser voice:', error);
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
    utterance.rate = 0.85;
    utterance.pitch = 1.2;
    utterance.volume = isMuted ? 0 : 1;

    const voices = speechSynthesis.getVoices();
    
    // STRICTLY enforce female voice selection - NO MALE VOICES ALLOWED
    const femaleVoice = voices.find(voice => 
      // Prioritize high-quality female voices
      voice.name.includes('Samantha') || 
      voice.name.includes('Karen') ||
      voice.name.includes('Victoria') ||
      voice.name.includes('Susan') ||
      voice.name.includes('Allison') ||
      voice.name.includes('Ava') ||
      voice.name.includes('Serena') ||
      // Generic female voice patterns
      (voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')) ||
      // Exclude any male-sounding names and prioritize female
      (voice.lang.startsWith('en') && 
       !voice.name.toLowerCase().includes('male') && 
       !voice.name.toLowerCase().includes('daniel') &&
       !voice.name.toLowerCase().includes('alex') &&
       !voice.name.toLowerCase().includes('fred') &&
       !voice.name.toLowerCase().includes('junior') &&
       voice.name.toLowerCase().includes('us'))
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
      console.log('Using browser voice:', femaleVoice.name);
    } else {
      // Last resort: find any English voice that's not explicitly male
      const fallbackVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        !voice.name.toLowerCase().includes('male') &&
        !voice.name.toLowerCase().includes('daniel')
      );
      if (fallbackVoice) {
        utterance.voice = fallbackVoice;
        console.log('Using fallback voice:', fallbackVoice.name);
      }
    }

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPlaying) {
      handleStop();
    } else {
      generateSpeech();
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
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Properly handle muting for ElevenLabs audio
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : 1;
      if (newMutedState) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
    
    // Handle browser speech synthesis muting
    if (newMutedState && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
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

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && text.trim()) {
      const timer = setTimeout(() => {
        generateSpeech();
      }, 1000); // Small delay for better UX
      
      return () => clearTimeout(timer);
    }
  }, [text, autoPlay]);

  return (
    <Card className={`p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex flex-col space-y-4">
        {/* Voice Guide Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button
              variant="default"
              size="lg"
              onClick={handlePlay}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 w-full sm:w-auto text-base font-semibold shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  <span>Loading Voice...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="h-5 w-5 mr-3" />
                  <span>Pause Voice Guide</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 mr-3" />
                  <span>Play Voice Guide</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={toggleMute}
              className="hover:bg-blue-100 border-blue-300 p-3 flex-shrink-0"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-gray-400" />
              ) : (
                <Volume2 className="h-5 w-5 text-blue-600" />
              )}
            </Button>
          </div>
          
          {/* Voice Status & Preview */}
          <div className="flex-1 w-full">
            <div className="flex items-center mb-3">
              <Headphones className="h-5 w-5 text-blue-600 mr-2" />
              <Sparkles className="h-4 w-4 text-purple-600 mr-2" />
              <p className="text-base font-bold text-blue-900">
                Voice Guide
              </p>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed bg-blue-50 p-3 rounded-lg">
              {text.length > 120 ? `${text.substring(0, 120)}...` : text}
            </p>
          </div>
          
          {/* Audio Visualizer */}
          {isPlaying && (
            <div className="flex space-x-1 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-blue-500 to-purple-500 animate-pulse rounded-full"
                  style={{
                    height: `${Math.random() * 20 + 15}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Guide Instructions */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            🎧 Put on headphones for the best VoiceCard experience
          </p>
        </div>
      </div>
      
      <audio ref={audioRef} className="hidden" />
    </Card>
  );
};

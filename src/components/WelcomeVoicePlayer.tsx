
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { createAudioFromText } from '@/services/elevenlabs';

interface WelcomeVoicePlayerProps {
  className?: string;
}

export const WelcomeVoicePlayer = ({ className = '' }: WelcomeVoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const welcomeText = "Welcome to your VoiceCard assessment! This personalized assessment will help you gain valuable insights about yourself. Please fill out your information below, and then we'll begin your journey of discovery together. Take your time and answer honestly for the best results.";

  const playWelcomeVoice = async () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsLoading(true);

    try {
      // Generate audio from text using ElevenLabs
      const generatedAudioUrl = await createAudioFromText(welcomeText);
      setAudioUrl(generatedAudioUrl);

      const audio = new Audio(generatedAudioUrl);
      audio.volume = isMuted ? 0 : 1;
      
      audio.oncanplaythrough = () => {
        setIsLoading(false);
      };
      
      audio.onplay = () => {
        setIsPlaying(true);
      };
      
      audio.onpause = () => {
        setIsPlaying(false);
      };
      
      audio.onended = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = (e) => {
        setIsLoading(false);
        setIsPlaying(false);
        console.error('Error loading welcome voice audio:', e);
      };

      audioRef.current = audio;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing welcome voice:', error);
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Error generating welcome voice:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      handleStop();
    } else {
      playWelcomeVoice();
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : 1;
    }
  };

  // Auto-play welcome message after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      playWelcomeVoice();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <Card className={`p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-2">🎧 Welcome Message</h3>
          <p className="text-sm text-blue-600">Listen to your personalized greeting</p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="default"
            size="lg"
            onClick={handlePlay}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Loading...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="h-5 w-5 mr-3" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-3" />
                <span>Play Welcome</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={toggleMute}
            className="hover:bg-blue-100 border-blue-300 p-3 bg-white"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-gray-400" />
            ) : (
              <Volume2 className="h-5 w-5 text-blue-600" />
            )}
          </Button>
        </div>

        <div className="text-center">
          {isPlaying ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="text-sm text-blue-700 font-medium">🎵 Playing welcome message...</div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 animate-pulse rounded-full"
                    style={{
                      height: `${Math.random() * 12 + 8}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  ></div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-blue-600">🎧 Put on headphones for the best experience</p>
          )}
        </div>
      </div>
    </Card>
  );
};


import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Mic } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { createAudioFromText } from '@/services/elevenlabs';

interface VoicePlayerProps {
  text: string;
  autoPlay?: boolean;
  className?: string;
  showTranscript?: boolean;
  isResultsPage?: boolean;
}

export const VoicePlayer = ({ text, autoPlay = false, className = '', showTranscript = false, isResultsPage = false }: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playDynamicVoice = async () => {
    console.log('Starting voice playback...');
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    setIsLoading(true);

    try {
      // Generate audio from text using ElevenLabs
      const generatedAudioUrl = await createAudioFromText(text);
      setAudioUrl(generatedAudioUrl);

      // Create new audio element
      const audio = new Audio(generatedAudioUrl);
      audio.volume = isMuted ? 0 : volume;
      
      audio.oncanplaythrough = () => {
        console.log('Audio can play through');
        setIsLoading(false);
      };
      
      audio.onplay = () => {
        console.log('Audio started playing');
        setIsPlaying(true);
      };
      
      audio.onpause = () => {
        console.log('Audio paused');
        setIsPlaying(false);
      };
      
      audio.onended = () => {
        console.log('Audio ended');
        setIsPlaying(false);
      };
      
      audio.onerror = (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      };

      audioRef.current = audio;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing voice:', error);
          setIsPlaying(false);
          setIsLoading(false);
        });
      }
    } catch (error) {
      console.error('Error generating voice:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (isPlaying) {
      handleStop();
    } else {
      playDynamicVoice();
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
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
    
    console.log('Mute toggled:', newMutedState ? 'MUTED' : 'UNMUTED');
  };

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && text && text.trim().length > 0) {
      const timer = setTimeout(() => {
        console.log('Auto-playing voice...');
        playDynamicVoice();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, text]);

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

  // For results page, use simplified layout
  if (isResultsPage) {
    return (
      <Card className={`p-4 bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-xl shadow-xl ${className}`}>
        <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
          <div className="bg-purple-600 p-3 rounded-full mb-3 sm:mb-0 sm:mr-4">
            <Mic className="h-5 w-5 text-white" />
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-black text-purple-900 mb-1">🎧 Your Personalized Voice Message</h3>
            <p className="text-sm text-purple-700 font-bold">Press play to hear your results!</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-3">
          <Button
            variant="default"
            size="lg"
            onClick={handlePlay}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 font-semibold shadow-lg"
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
                <span>Play</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={toggleMute}
            className={`hover:bg-blue-100 border-blue-300 p-3 transition-all duration-200 ${
              isMuted ? 'bg-red-100 border-red-300' : 'bg-white'
            }`}
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-red-500" />
            ) : (
              <Volume2 className="h-5 w-5 text-blue-600" />
            )}
          </Button>
        </div>

        <div className="mt-4 text-center">
          {isPlaying ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="text-sm text-purple-700 font-medium">🎵 Playing your message...</div>
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
            <p className="text-xs text-purple-600">🎧 Put on headphones for the best experience</p>
          )}
        </div>
      </Card>
    );
  }

  // Standard assessment layout with properly functioning mute button
  return (
    <Card className={`p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex flex-col space-y-4">
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
                  <span>Play</span>
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={toggleMute}
              className={`hover:bg-blue-100 border-blue-300 p-3 flex-shrink-0 transition-all duration-200 ${
                isMuted ? 'bg-red-100 border-red-300' : 'bg-white'
              }`}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-red-500" />
              ) : (
                <Volume2 className="h-5 w-5 text-blue-600" />
              )}
            </Button>
          </div>
          
          <div className="flex-1 w-full">
            <div className="bg-blue-50 p-3 rounded-lg">
              {isPlaying ? (
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-blue-700 font-medium">🎵 Playing...</div>
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
                <p className="text-sm text-blue-700">Ready to play your custom voice message</p>
              )}
            </div>
          </div>
          
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

        <div className="text-center">
          <p className="text-xs text-gray-500">
            🎧 Put on headphones for the best VoiceCard experience
          </p>
        </div>
      </div>
    </Card>
  );
};

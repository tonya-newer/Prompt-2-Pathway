
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { customVoiceService } from '@/services/customVoiceService';
import { nativeSpeech } from '@/services/nativeSpeech';
import { InteractionGate } from './InteractionGate';

interface WelcomeVoicePlayerProps {
  className?: string;
}

export const WelcomeVoicePlayer = ({ className = '' }: WelcomeVoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomVoice, setUseCustomVoice] = useState(false);
  const [showInteractionGate, setShowInteractionGate] = useState(true);

  useEffect(() => {
    const checkCustomVoice = async () => {
      try {
        const exists = await customVoiceService.checkVoiceExists('welcome');
        setUseCustomVoice(exists);
      } catch (error) {
        console.error('[WelcomeVoicePlayer] Error checking custom voice:', error);
        setUseCustomVoice(false);
      }
    };

    checkCustomVoice();
  }, []);

  const playWelcomeVoice = async () => {
    try {
      if (useCustomVoice) {
        await customVoiceService.playVoice(
          'welcome',
          0,
          () => {
            setIsLoading(false);
            setIsPlaying(true);
          },
          () => {
            setIsPlaying(false);
            setIsPaused(false);
          });
      } else {
        console.log('[WelcomeVoicePlayer] No custom voice available - staying silent');
      }
    } catch (error) {
      console.error('[WelcomeVoicePlayer] Error playing welcome voice:', error);
    }
  };

  const handlePlayPause = async () => {
    if (isLoading) return;

    if (isPlaying && !isPaused) {
      if (useCustomVoice) {
        await customVoiceService.pauseVoice();
      } else {
        nativeSpeech.stop();
      }

      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    if (isPaused) {
      if (useCustomVoice) {
        customVoiceService.resumeVoice();
        setIsPaused(false);
        setIsPlaying(true);
        return;
      }
    }
    
    customVoiceService.stopVoice();
    nativeSpeech.stop();

    setIsLoading(true);
    setIsPaused(false);

    try {
      if (useCustomVoice) {
        await playWelcomeVoice();
      }
    } catch (error) {
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const handleInteractionGateStart = async () => {
    setShowInteractionGate(false);
    await playWelcomeVoice();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (useCustomVoice) {
        customVoiceService.stopVoice();
      } else {
        nativeSpeech.stop();
      }
    };
  }, []);

  return (
    <>
      {showInteractionGate && (
        <InteractionGate
          onInteraction={handleInteractionGateStart}
        />
      )}
      
      <Card className={`p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="text-center mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">🎧 Welcome Message</h3>
            <p className="text-xs sm:text-sm text-blue-600">Listen to your personalized greeting</p>
          </div>
          
          <div className="flex items-center justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={handlePlayPause}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold shadow-lg w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-3"></div>
                  <span>Loading...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-3" />
                  <span>Play Welcome</span>
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            {isPlaying ? (
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="text-xs sm:text-sm text-blue-700 font-medium">🎵 Playing welcome message...</div>
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
              <p className="text-xs text-blue-600">🎧 Click play to hear your welcome message</p>
            )}
          </div>
        </div>
      </Card>
    </>
  );
};

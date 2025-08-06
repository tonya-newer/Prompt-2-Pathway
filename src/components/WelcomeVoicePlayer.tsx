
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
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [useCustomVoice, setUseCustomVoice] = useState(false);
  const [showInteractionGate, setShowInteractionGate] = useState(true);

  const welcomeText = "Welcome to your Prompt 2 Pathway assessment! This personalized assessment will help you gain valuable insights about yourself. Please fill out your information below, and then we'll begin your journey of discovery together. Take your time and answer honestly for the best results.";

  useEffect(() => {
    // Check if custom welcome voice exists - NO TESTING, just check
    const checkCustomVoice = async () => {
      try {
        console.log('[WelcomeVoicePlayer] Checking for custom welcome voice (no test playback)...');
        
        // Only check if file exists, do NOT test play it
        const exists = await customVoiceService.checkVoiceExists('welcome');
        console.log('[WelcomeVoicePlayer] Voice exists check result:', exists);
        
        setUseCustomVoice(exists);
      } catch (error) {
        console.error('[WelcomeVoicePlayer] Error checking custom voice:', error);
        setUseCustomVoice(false);
      }
    };

    checkCustomVoice();
  }, []);

  const playWelcomeVoice = async () => {
    console.log('[WelcomeVoicePlayer] Starting welcome voice playback...');
    console.log('[WelcomeVoicePlayer] useCustomVoice:', useCustomVoice);
    setIsLoading(true);

    try {
      setIsPlaying(true);
      
      if (useCustomVoice) {
        // Use custom ElevenLabs voice
        console.log('[WelcomeVoicePlayer] Playing custom welcome voice...');
        await customVoiceService.playVoice('welcome');
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('[WelcomeVoicePlayer] Error playing welcome voice:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = async () => {
    setHasInteracted(true);
    
    if (isPlaying) {
      handleStop();
    } else {
      await playWelcomeVoice();
    }
  };

  const handleStop = () => {
    if (useCustomVoice) {
      customVoiceService.stopVoice();
    } else {
      nativeSpeech.stop();
    }
    setIsPlaying(false);
  };

  const handleInteractionGateStart = () => {
    setShowInteractionGate(false);
    setHasInteracted(true);
    // NO AUTO-PLAY - let user manually click play to avoid any looping issues
    console.log('[WelcomeVoicePlayer] User interaction completed - no autoplay');
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
          title="🎧 Welcome to Your Voice Experience"
          description="Your personalized assessment includes voice guidance. Tap to start and hear your welcome message."
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
              onClick={handlePlay}
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

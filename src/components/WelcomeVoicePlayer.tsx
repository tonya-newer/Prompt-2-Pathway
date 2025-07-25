
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { customVoiceService } from '@/services/customVoiceService';
import { nativeSpeech } from '@/services/nativeSpeech';

interface WelcomeVoicePlayerProps {
  className?: string;
}

export const WelcomeVoicePlayer = ({ className = '' }: WelcomeVoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [useCustomVoice, setUseCustomVoice] = useState(false);

  const welcomeText = "Welcome to your VoiceCard assessment! This personalized assessment will help you gain valuable insights about yourself. Please fill out your information below, and then we'll begin your journey of discovery together. Take your time and answer honestly for the best results.";

  useEffect(() => {
    // Check if custom welcome voice exists
    const checkCustomVoice = async () => {
      const exists = await customVoiceService.checkVoiceExists('welcome');
      setUseCustomVoice(exists);
    };

    checkCustomVoice();
  }, []);

  const playWelcomeVoice = async () => {
    console.log('Starting welcome voice playback...');
    setIsLoading(true);

    try {
      setIsPlaying(true);
      
      if (useCustomVoice) {
        // Use custom ElevenLabs voice
        await customVoiceService.playVoice('welcome');
      } else {
        // Fallback to native speech
        await nativeSpeech.speak({
          text: welcomeText,
          rate: 0.85,
          pitch: 1.0,
          volume: 1.0
        });
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing welcome voice:', error);
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

  // Auto-play after user interaction (required for browser autoplay policy)
  useEffect(() => {
    if (hasInteracted) {
      const timer = setTimeout(() => {
        console.log('Auto-playing welcome message after interaction...');
        playWelcomeVoice();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasInteracted]);

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
    <Card className={`p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex flex-col space-y-4">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-blue-800 mb-2">🎧 Welcome Message</h3>
          <p className="text-sm text-blue-600">Listen to your personalized greeting</p>
          <p className="text-xs text-blue-500 mt-1">
            {useCustomVoice ? 'Custom ElevenLabs Voice' : 'Native Voice'}
          </p>
        </div>
        
        <div className="flex items-center justify-center">
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
            <p className="text-xs text-blue-600">🎧 Click play to hear your welcome message</p>
          )}
        </div>
      </div>
    </Card>
  );
};

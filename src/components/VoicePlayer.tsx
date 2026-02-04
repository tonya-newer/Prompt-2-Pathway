import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Mic, VolumeX, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { customVoiceService } from '@/services/customVoiceService';
import { nativeSpeech } from '@/services/nativeSpeech';

interface VoicePlayerProps {
  text: string;
  autoPlay?: boolean;
  isResultsPage?: boolean;
  questionId?: number;
  customVoiceType?: 'welcome' | 'question' | 'congratulations' | 'contact-form';
  className?: string;
}

export const VoicePlayer = ({ 
  text, 
  autoPlay = false, 
  isResultsPage = false, 
  questionId,
  customVoiceType,
  className = "" 
}: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useCustomVoice, setUseCustomVoice] = useState(false);

  const checkCustomVoice = useCallback(async () => {
    try {
      let voiceExists = false;
      
      if (customVoiceType) {
        voiceExists = await customVoiceService.checkVoiceExists(customVoiceType, questionId);
        console.log(`${customVoiceType} voice check:`, voiceExists);
      } else if (isResultsPage) {
        voiceExists = await customVoiceService.checkVoiceExists('congratulations');
        console.log('Results page voice check:', voiceExists);
      } else if (questionId) {
        voiceExists = await customVoiceService.checkVoiceExists('question', questionId);
        console.log(`Question ${questionId} voice check:`, voiceExists);
      }
      
      setUseCustomVoice(voiceExists);
      console.log('useCustomVoice:', voiceExists, 'isResultsPage:', isResultsPage);
    } catch (error) {
      console.error('Error checking custom voice:', error);
      setUseCustomVoice(false);
    }
  }, [isResultsPage, questionId, customVoiceType]);

  useEffect(() => {
    checkCustomVoice();
  }, [checkCustomVoice]);

  const playCustomVoice = useCallback(async () => {
    try {
      if (customVoiceType) {
        await customVoiceService.playVoice(
          customVoiceType,
          questionId,
          () => {
            setIsLoading(false);
            setIsPlaying(true);
          }, 
          () => {
            setIsPlaying(false);
            setIsPaused(false);
          }
        );
      } else if (isResultsPage) {
        await customVoiceService.playVoice(
          'congratulations',
          questionId,
          () => {
            setIsLoading(false);
            setIsPlaying(true);
          },
          () => {
            setIsPlaying(false);
            setIsPaused(false);
          }
        );
      } else if (questionId) {
        await customVoiceService.playVoice(
          'question',
          questionId,
          () => {
            setIsLoading(false);
            setIsPlaying(true);
          },
          () => {
            setIsPlaying(false);
            setIsPaused(false);
          }
        );
      }
    } catch (error) {
      console.error('Error playing custom voice:', error);
      // Fallback to native speech
      nativeSpeech.speak({ text });
    }
  }, [isResultsPage, questionId, customVoiceType, text]);

  // Auto-play logic - ONLY use custom voice, no fallback to native speech
  useEffect(() => {
    if (autoPlay && useCustomVoice && (customVoiceType === 'contact-form' || (text && text.trim().length > 0))) {
      console.log('[VoicePlayer] Auto-playing custom voice for results page:', isResultsPage);
      
      // Stop any existing audio first with enhanced cleanup
      customVoiceService.stopVoice();
      nativeSpeech.stop();
      
      // Create user interaction context for autoplay
      const attemptAutoPlay = async () => {
        try {
          console.log('[VoicePlayer] Actually starting auto-play...');
          setIsPlaying(true);
          await playCustomVoice();
        } catch (error) {
          console.warn('[VoicePlayer] Auto-play failed (likely due to browser policy):', error);
          // Don't show error to user, they can manually play
        } finally {
          setIsPlaying(false);
        }
      };
      
      // Shorter delay for results page to start voice message immediately after celebration
      const delay = isResultsPage ? 200 : (questionId === 1 ? 100 : 300);
      setTimeout(attemptAutoPlay, delay);
    } else if (autoPlay && !useCustomVoice) {
      console.log('[VoicePlayer] No custom voice available - skipping auto-play (no fallback to native speech)');
    }
  }, [autoPlay, useCustomVoice, text, questionId, playCustomVoice, isResultsPage, customVoiceType]);

  const handlePlayPause = async () => {
    if (isLoading) return;
    
    // Case 1: Currently playing → pause
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

    // Case 2: Currently paused → resume
    if (isPaused) {
      if (useCustomVoice) {
        customVoiceService.resumeVoice();
      } else {
        nativeSpeech.speak({ text });
      }

      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    // Case 3: Stopped → start fresh

    // Stop any existing audio before starting new playback
    customVoiceService.stopVoice();
    nativeSpeech.stop();

    setIsLoading(true);
    setIsPaused(false);

    try {
      if (useCustomVoice) {
        await playCustomVoice();
      } else {
        setIsLoading(false);
        setIsPlaying(true);
        await nativeSpeech.speak({ text });
      }
    } catch (error) {
      console.error('[VoicePlayer] Error playing voice:', error);
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  // For results page, use the enhanced layout
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
            onClick={handlePlayPause}
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
            <p className="text-xs text-purple-600">🎧 Click play to hear your personalized message</p>
          )}
        </div>
      </Card>
    );
  }

  // Standard layout for questions and contact form
  return (
    <Card className={`p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
      <div className="flex flex-col space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Button
              variant="default"
              size="lg"
              onClick={handlePlayPause}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 py-3 flex-1 sm:flex-none text-sm sm:text-base font-semibold shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                  <span>Loading...</span>
                </>
              ) : isPlaying ? (
                <>
                  <Pause className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" />
                  <span>Play</span>
                </>
              )}
            </Button>
          </div>
          
          {isPlaying && (
            <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <div className="text-xs sm:text-sm text-blue-700 font-medium">🎵 Playing voice message...</div>
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
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            🎧 Click play to activate voice guidance
          </p>
        </div>
      </div>
    </Card>
  );
};
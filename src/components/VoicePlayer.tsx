
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Mic, VolumeX, Volume2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { customVoiceService } from '@/services/customVoiceService';
import { nativeSpeech } from '@/services/nativeSpeech';
import { InteractionGate } from './InteractionGate';

interface VoicePlayerProps {
  text: string;
  autoPlay?: boolean;
  className?: string;
  showTranscript?: boolean;
  isResultsPage?: boolean;
  questionId?: number;
}

export const VoicePlayer = ({ 
  text, 
  autoPlay = false, 
  className = '', 
  showTranscript = false, 
  isResultsPage = false, 
  questionId 
}: VoicePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [useCustomVoice, setUseCustomVoice] = useState(false);
  const [showInteractionGate, setShowInteractionGate] = useState(!isResultsPage && !autoPlay);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // CRITICAL: Stop any native speech immediately to prevent interference
    nativeSpeech.stop();
    
    // Check if custom voice file exists and handle auto-play
    const initializeVoice = async () => {
      console.log('[VoicePlayer] Initializing voice - isResultsPage:', isResultsPage, 'questionId:', questionId);
      
      if (isResultsPage) {
        console.log('[VoicePlayer] Checking congratulations voice...');
        const exists = await customVoiceService.checkVoiceExists('congratulations');
        console.log('[VoicePlayer] Congratulations voice exists:', exists);
        setUseCustomVoice(exists);
        
        // FIXED: Auto-play immediately with voice availability known
        if (autoPlay && exists && !isMuted && text && text.trim().length > 0) {
          console.log('[VoicePlayer] Auto-playing congratulations voice...');
          await playVoiceWithType('congratulations', exists);
        } else {
          console.log('[VoicePlayer] Congratulations auto-play conditions not met:', { autoPlay, exists, isMuted, hasText: text && text.trim().length > 0 });
        }
      } else if (questionId) {
        console.log('[VoicePlayer] Checking question voice for question:', questionId);
        
        // CRITICAL: For Question 1, ensure no native voice interference
        if (questionId === 1) {
          console.log('[VoicePlayer] Question 1 detected - ensuring native speech is stopped');
          nativeSpeech.stop();
        }
        
        const exists = await customVoiceService.checkVoiceExists('question', questionId);
        console.log('[VoicePlayer] Question voice exists:', exists);
        setUseCustomVoice(exists);
        
        // FIXED: Auto-play immediately with voice availability known
        if (autoPlay && exists && !isMuted && text && text.trim().length > 0) {
          console.log(`[VoicePlayer] Auto-playing custom question voice for Q${questionId}...`);
          await playVoiceWithType('question', exists, questionId);
        } else {
          console.log(`[VoicePlayer] Question ${questionId} auto-play conditions not met:`, { autoPlay, exists, isMuted, hasText: text && text.trim().length > 0, questionId });
          
          // CRITICAL: Never allow native speech for any question when autoPlay is true
          if (autoPlay) {
            console.log(`[VoicePlayer] AutoPlay enabled but custom voice not available for Q${questionId} - NO FALLBACK ALLOWED`);
            nativeSpeech.stop();
          }
        }
      } else {
        console.log('[VoicePlayer] No questionId or isResultsPage - no auto-play');
        setUseCustomVoice(false);
      }
    };

    initializeVoice();
  }, [isResultsPage, questionId, autoPlay, isMuted, text]);

  const playDefaultVoice = async () => {
    console.log('[VoicePlayer] Playing fallback native speech...');
    await nativeSpeech.speak({
      text: text,
      rate: 0.85,
      pitch: 1.0,
      volume: 1.0
    });
  };

  // FIXED: New function that takes voice availability as parameter to avoid race conditions
  const playVoiceWithType = async (type: 'question' | 'congratulations', hasCustomVoice: boolean, questionId?: number) => {
    if (isMuted) {
      console.log('[VoicePlayer] Playback muted, skipping...');
      return;
    }
    
    console.log('[VoicePlayer] Starting voice playback with known availability...');
    console.log('[VoicePlayer] hasCustomVoice:', hasCustomVoice, 'type:', type, 'questionId:', questionId);
    setIsLoading(true);

    try {
      setIsPlaying(true);
      
      if (hasCustomVoice) {
        // Use custom voice - we already confirmed it exists
        if (type === 'congratulations') {
          console.log('[VoicePlayer] Playing custom congratulations voice...');
          await customVoiceService.playVoice('congratulations');
        } else if (type === 'question' && questionId) {
          console.log('[VoicePlayer] Playing custom question voice for question:', questionId);
          await customVoiceService.playVoice('question', questionId);
        }
      } else {
        // No custom voice available
        if (type === 'congratulations') {
          console.log('[VoicePlayer] Results page - no custom voice available, skipping playback');
          throw new Error('No custom voice available for results page');
        } else {
          // CRITICAL: Never play native speech when autoPlay is true
          console.log('[VoicePlayer] AutoPlay enabled but no custom voice - skipping playback');
          throw new Error('No custom voice available for auto-play');
        }
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('[VoicePlayer] Error playing voice:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const playVoice = async () => {
    if (isMuted) {
      console.log('[VoicePlayer] Playback muted, skipping...');
      return;
    }
    
    console.log('[VoicePlayer] Manual play triggered...');
    console.log('[VoicePlayer] useCustomVoice:', useCustomVoice, 'isResultsPage:', isResultsPage, 'questionId:', questionId);
    setIsLoading(true);

    try {
      setIsPlaying(true);
      
      if (useCustomVoice) {
        // Use custom voice
        if (isResultsPage) {
          console.log('[VoicePlayer] Playing custom congratulations voice...');
          await customVoiceService.playVoice('congratulations');
        } else if (questionId) {
          console.log('[VoicePlayer] Playing custom question voice for question:', questionId);
          await customVoiceService.playVoice('question', questionId);
        }
      } else {
        // Fallback for manual clicks only
        if (isResultsPage) {
          console.log('[VoicePlayer] Results page - no custom voice available, skipping playback');
          throw new Error('No custom voice available for results page');
        } else {
          console.log('[VoicePlayer] Manual play - using native speech fallback');
          await playDefaultVoice();
        }
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('[VoicePlayer] Error playing voice:', error);
      // For results page, don't attempt native voice fallback
      if (isResultsPage) {
        console.log('[VoicePlayer] Results page - custom voice failed, no fallback attempted');
      } else {
        console.log('[VoicePlayer] Attempting fallback to native speech due to error...');
        try {
          await playDefaultVoice();
        } catch (fallbackError) {
          console.error('[VoicePlayer] Fallback to native speech also failed:', fallbackError);
        }
      }
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
      await playVoice();
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
    
    // Auto-play after user interaction if autoPlay is enabled
    if (autoPlay && text && text.trim().length > 0) {
      setTimeout(() => {
        console.log('Auto-playing voice after user interaction...');
        playVoice();
      }, 500);
    }
  };

  // FIXED: Enhanced cleanup for voice overlap prevention
  useEffect(() => {
    return () => {
      console.log('[VoicePlayer] Component unmounting - stopping all audio');
      customVoiceService.stopVoice();
      nativeSpeech.stop();
      setIsPlaying(false);
    };
  }, []);

  // FIXED: Stop audio when navigating between questions
  useEffect(() => {
    return () => {
      if (isPlaying) {
        console.log('[VoicePlayer] Question changed - stopping current audio');
        customVoiceService.stopVoice();
        nativeSpeech.stop();
        setIsPlaying(false);
      }
    };
  }, [questionId]);

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
            onClick={handlePlay}
            disabled={isLoading || isMuted}
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
            onClick={() => {
              setIsMuted(!isMuted);
              if (isPlaying) {
                handleStop();
              }
            }}
            className="border-2 border-purple-300 hover:border-purple-400 px-4 py-3"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-purple-600" />
            ) : (
              <Volume2 className="h-5 w-5 text-purple-600" />
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

  // Standard assessment layout with interaction gate
  return (
    <>
      {showInteractionGate && questionId && (
        <InteractionGate
          onInteraction={handleInteractionGateStart}
          title={`🎧 Question ${questionId} Voice Guide`}
          description="Listen to your question with voice guidance. Tap to continue."
        />
      )}
      
      <Card className={`p-4 sm:p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-2 border-blue-200 shadow-lg ${className}`}>
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                onClick={handlePlay}
                disabled={isLoading || isMuted}
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (isPlaying) {
                    handleStop();
                  }
                }}
                className="border-2 border-blue-300 hover:border-blue-400 px-3 py-3"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4 text-blue-600" />
                ) : (
                  <Volume2 className="h-4 w-4 text-blue-600" />
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
    </>
  );
};

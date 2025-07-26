
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Mic } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { customVoiceService } from '@/services/customVoiceService';
import { nativeSpeech } from '@/services/nativeSpeech';

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

  useEffect(() => {
    // Check if custom voice file exists
    const checkCustomVoice = async () => {
      if (isResultsPage) {
        const exists = await customVoiceService.checkVoiceExists('congratulations');
        setUseCustomVoice(exists);
      } else if (questionId) {
        const exists = await customVoiceService.checkVoiceExists('question', questionId);
        setUseCustomVoice(exists);
      }
    };

    checkCustomVoice();
  }, [isResultsPage, questionId]);

  const playVoice = async () => {
    console.log('Starting voice playback...');
    setIsLoading(true);

    try {
      setIsPlaying(true);
      
      if (useCustomVoice) {
        // Use custom ElevenLabs voice
        if (isResultsPage) {
          await customVoiceService.playVoice('congratulations');
        } else if (questionId) {
          await customVoiceService.playVoice('question', questionId);
        }
      } else {
        // Fallback to native speech
        await nativeSpeech.speak({
          text: text,
          rate: 0.85,
          pitch: 1.0,
          volume: 1.0
        });
      }
      
      setIsPlaying(false);
    } catch (error) {
      console.error('Error playing voice:', error);
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

  // Auto-play functionality (only after user interaction)
  useEffect(() => {
    if (autoPlay && text && text.trim().length > 0 && hasInteracted) {
      const timer = setTimeout(() => {
        console.log('Auto-playing voice...');
        playVoice();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, text, hasInteracted]);

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

  // Standard assessment layout - no mute button
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 flex-1 sm:flex-none text-base font-semibold shadow-lg"
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
                <div>
                  <p className="text-sm text-blue-700">Click play to hear your custom voice message</p>
                </div>
              )}
            </div>
          </div>
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

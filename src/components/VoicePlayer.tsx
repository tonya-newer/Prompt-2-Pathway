
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX, Mic } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Enhanced female voice selection targeting natural-sounding female voices
  const speakWithNaturalVoice = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Natural speaking pace
    utterance.pitch = 1.2; // Higher pitch for female voice
    utterance.volume = isMuted ? 0 : 1;

    const voices = speechSynthesis.getVoices();
    console.log('Available voices:', voices.map(v => `${v.name} - ${v.lang}`));
    
    // Priority order for most natural female voices
    const naturalFemaleVoices = [
      'Samantha', // macOS natural female voice
      'Microsoft Eva - English (United States)', 
      'Microsoft Zira - English (United States)',
      'Google US English Female',
      'Karen', // macOS
      'Victoria', // macOS
      'Allison', // iOS
      'Ava', // iOS
      'Susan', // macOS
      'Joanna', // AWS Polly
      'Kendra', // AWS Polly
      'Kimberly', // AWS Polly
      'Salli', // AWS Polly
      'Emma',
      'Alice',
      'Anna'
    ];
    
    let selectedVoice = null;
    
    // First pass: Look for exact natural voice matches
    for (const voiceName of naturalFemaleVoices) {
      selectedVoice = voices.find(voice => 
        voice.name === voiceName || 
        voice.name.includes(voiceName)
      );
      if (selectedVoice && selectedVoice.lang.startsWith('en')) {
        console.log('Selected natural female voice:', selectedVoice.name);
        break;
      }
    }
    
    // Second pass: Look for US English voices with female indicators
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en-US') && 
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('zira') ||
         voice.name.toLowerCase().includes('eva') ||
         voice.name.toLowerCase().includes('samantha'))
      );
      if (selectedVoice) {
        console.log('Selected US English female voice:', selectedVoice.name);
      }
    }
    
    // Third pass: Exclude male voices and select best available
    if (!selectedVoice) {
      selectedVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        !voice.name.toLowerCase().includes('male') &&
        !voice.name.toLowerCase().includes('david') &&
        !voice.name.toLowerCase().includes('mark') &&
        !voice.name.toLowerCase().includes('daniel') &&
        !voice.name.toLowerCase().includes('matthew') &&
        !voice.name.toLowerCase().includes('alex') &&
        !voice.name.toLowerCase().includes('fred') &&
        !voice.name.toLowerCase().includes('bruce') &&
        !voice.name.toLowerCase().includes('thomas') &&
        !voice.name.toLowerCase().includes('james') &&
        !voice.lang.includes('GB') // Exclude British voices
      );
      if (selectedVoice) {
        console.log('Selected filtered voice:', selectedVoice.name);
      }
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log('Final voice selection:', selectedVoice.name, selectedVoice.lang);
    } else {
      console.log('Using default voice - will attempt to set higher pitch for female tone');
      utterance.pitch = 1.4; // Higher pitch if no specific female voice found
    }

    utterance.onstart = () => {
      console.log('Voice started playing');
      setIsPlaying(true);
    };
    utterance.onend = () => {
      console.log('Voice finished playing');
      setIsPlaying(false);
    };
    utterance.onerror = (error) => {
      console.error('Voice playback error:', error);
      setIsPlaying(false);
    };

    speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (isPlaying) {
      handleStop();
    } else {
      speakWithNaturalVoice();
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
    
    if (newMutedState && speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  // Enhanced auto-play functionality
  useEffect(() => {
    if (autoPlay && text.trim()) {
      const checkVoicesAndPlay = () => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Voices loaded, starting auto-play');
          setTimeout(() => {
            speakWithNaturalVoice();
          }, 1000); // Longer delay for better UX
        } else {
          setTimeout(checkVoicesAndPlay, 100);
        }
      };

      checkVoicesAndPlay();
      speechSynthesis.addEventListener('voiceschanged', checkVoicesAndPlay, { once: true });
      
      return () => {
        speechSynthesis.removeEventListener('voiceschanged', checkVoicesAndPlay);
      };
    }
  }, [text, autoPlay]);

  // For results page, use simplified layout with better audio timing
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
            className="hover:bg-blue-100 border-blue-300 p-3"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5 text-gray-400" />
            ) : (
              <Volume2 className="h-5 w-5 text-blue-600" />
            )}
          </Button>
        </div>

        {/* Audio status indicator */}
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
        
        <audio ref={audioRef} className="hidden" />
      </Card>
    );
  }

  // Standard assessment layout
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
              className="hover:bg-blue-100 border-blue-300 p-3 flex-shrink-0 cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-gray-400" />
              ) : (
                <Volume2 className="h-5 w-5 text-blue-600" />
              )}
            </Button>
          </div>
          
          {/* Audio status */}
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
                <p className="text-sm text-blue-700">Ready to play</p>
              )}
            </div>
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

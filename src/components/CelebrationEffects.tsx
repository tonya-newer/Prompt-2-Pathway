
import { useEffect, useState } from 'react';
import { Sparkles, Star, Heart } from 'lucide-react';

interface CelebrationEffectsProps {
  onComplete?: () => void;
}

export const CelebrationEffects = ({ onComplete }: CelebrationEffectsProps) => {
  const [showEffects, setShowEffects] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // Play the celebration audio file immediately
    if (!audioPlayed) {
      const playCelebrationAudio = async () => {
        try {
          console.log('Attempting to play celebration audio...');
          
          // Try to play the celebration audio from the correct location
          const audioPaths = [
            '/src/assets/celebration-audio.mp3'
          ];
          
          let audioPlayed = false;
          
          for (const path of audioPaths) {
            if (audioPlayed) break;
            
            try {
              const audio = new Audio(path);
              audio.volume = 0.7;
              
              // Create a promise to handle audio loading and playing
              const playAudio = new Promise<void>((resolve, reject) => {
                audio.oncanplaythrough = () => {
                  console.log(`Celebration audio loaded from ${path}`);
                  audio.play()
                    .then(() => {
                      console.log(`Celebration audio playing from ${path}`);
                      audioPlayed = true;
                      resolve();
                    })
                    .catch(reject);
                };
                
                audio.onerror = () => {
                  console.log(`Failed to load celebration audio from ${path}`);
                  reject(new Error(`Failed to load from ${path}`));
                };
                
                audio.load();
              });
              
              await playAudio;
              break; // Exit loop if successful
            } catch (error) {
              console.log(`Could not play celebration audio from ${path}:`, error);
              continue; // Try next path
            }
          }
          
          if (!audioPlayed) {
            console.log('No celebration audio files could be loaded');
          }
          
          setAudioPlayed(true);
        } catch (error) {
          console.log('Audio not supported or failed to play, continuing without celebration audio');
          setAudioPlayed(true);
        }
      };

      playCelebrationAudio();
    }

    // Show effects for 3 seconds, then hide and call onComplete
    const timer = setTimeout(() => {
      setShowEffects(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Short pause before callback
      }
    }, 3000); // 3 seconds of effects

    return () => clearTimeout(timer);
  }, [audioPlayed, onComplete]);

  if (!showEffects) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Sparkles Animation */}
      {[...Array(20)].map((_, i) => (
        <div
          key={`sparkle-${i}`}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${1 + Math.random() * 2}s`
          }}
        >
          <Sparkles 
            className="text-yellow-400 animate-pulse" 
            size={12 + Math.random() * 20}
          />
        </div>
      ))}

      {/* Confetti Stars */}
      {[...Array(15)].map((_, i) => (
        <div
          key={`star-${i}`}
          className="absolute animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1.5}s`,
            animationDuration: `${0.8 + Math.random() * 1.2}s`
          }}
        >
          <Star 
            className="text-purple-500 fill-current" 
            size={8 + Math.random() * 16}
          />
        </div>
      ))}

      {/* Hearts */}
      {[...Array(10)].map((_, i) => (
        <div
          key={`heart-${i}`}
          className="absolute animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 1}s`,
            animationDuration: `${1.5 + Math.random() * 1}s`
          }}
        >
          <Heart 
            className="text-red-400 fill-current" 
            size={10 + Math.random() * 14}
          />
        </div>
      ))}

      {/* Center burst effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="animate-ping">
          <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full opacity-75"></div>
        </div>
      </div>
    </div>
  );
};

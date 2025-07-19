import { useEffect, useState } from 'react';
import { Sparkles, Star, Heart } from 'lucide-react';
import celebrationAudio from '@/assets/celebration-audio.mp3';

interface CelebrationEffectsProps {
  onComplete?: () => void;
}

export const CelebrationEffects = ({ onComplete }: CelebrationEffectsProps) => {
  const [showEffects, setShowEffects] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // Play the downloaded celebration audio file
    if (!audioPlayed) {
      const playCelebrationAudio = () => {
        try {
          const audio = new Audio(celebrationAudio);
          audio.volume = 0.7;
          
          audio.onloadeddata = () => {
            console.log('Celebration audio loaded and playing');
            audio.play().catch(error => {
              console.log('Could not play celebration audio:', error);
            });
          };
          
          audio.onerror = () => {
            console.log('Error loading celebration audio, skipping');
          };
          
          setAudioPlayed(true);
        } catch (error) {
          console.log('Audio not supported, skipping celebration audio');
          setAudioPlayed(true);
        }
      };

      playCelebrationAudio();
    }

    // Show sparkles for 5 seconds, then hide and call onComplete
    const timer = setTimeout(() => {
      setShowEffects(false);
      if (onComplete) {
        setTimeout(onComplete, 1000); // 1 second pause before voice guide
      }
    }, 5000); // 5 seconds of sparkles

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
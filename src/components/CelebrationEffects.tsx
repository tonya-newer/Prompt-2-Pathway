
import { useEffect, useState } from 'react';
import { Sparkles, Star, Heart } from 'lucide-react';
import { celebrationAudio } from '@/pages/ContactForm';

interface CelebrationEffectsProps {
  onComplete?: () => void;
}

export const CelebrationEffects = ({ onComplete }: CelebrationEffectsProps) => {
  const [showEffects, setShowEffects] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    console.log('CelebrationEffects component mounted');
    const onEnded = () => {
      console.log('Celebration sound ended');
      setShowEffects(false);
      if (onComplete) onComplete();
    }

    if (celebrationAudio) {
      celebrationAudio.currentTime = 0;
      celebrationAudio.addEventListener('ended', onEnded);
    }

    // Play the celebration sound effect immediately (not voice message)
    if (!audioPlayed) {
      const playCelebrationAudio = async () => {
        try {
          await celebrationAudio.play();
          console.log('Celebration sound effect playing');
        } catch (error) {
          console.log('Could not play celebration sound effect:', error);
          setShowEffects(false);
          if (onComplete) onComplete();
        }

        setAudioPlayed(true);
      };

      playCelebrationAudio();
    }

    return () => {
      if (celebrationAudio) {
        celebrationAudio.removeEventListener('ended', onEnded);
      }
    };
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

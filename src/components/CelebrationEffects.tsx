import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Star, Heart } from 'lucide-react';
import { customVoiceService } from '@/services/customVoiceService';
import { RootState } from '@/store';

interface CelebrationEffectsProps {
  onComplete?: () => void;
  /** Minimum time to show effects in ms when no audio (default 3000). */
  minDisplayMs?: number;
}

export const CelebrationEffects = ({ onComplete, minDisplayMs = 3000 }: CelebrationEffectsProps) => {
  const [showEffects, setShowEffects] = useState(true);
  const playedRef = useRef(false);
  const assessment = useSelector((state: RootState) => state.assessments.selected);

  useEffect(() => {
    if (playedRef.current) return;
    playedRef.current = true;

    const finish = () => {
      setShowEffects(false);
      onComplete?.();
    };

    const playCongratulations = async () => {
      if (assessment) customVoiceService.setAssessment(assessment);
      const hasVoice = assessment && await customVoiceService.checkVoiceExists('congratulations');
      if (!hasVoice) {
        setTimeout(finish, minDisplayMs);
        return;
      }
      try {
        await customVoiceService.playVoice(
          'congratulations',
          undefined,
          undefined,
          finish
        );
      } catch {
        setTimeout(finish, minDisplayMs);
      }
    };

    playCongratulations();
  }, [assessment, onComplete, minDisplayMs]);

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

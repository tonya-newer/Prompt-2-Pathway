import { useEffect, useState } from 'react';
import { Sparkles, Star, Heart } from 'lucide-react';

interface CelebrationEffectsProps {
  onComplete?: () => void;
}

export const CelebrationEffects = ({ onComplete }: CelebrationEffectsProps) => {
  const [showEffects, setShowEffects] = useState(true);
  const [audioPlayed, setAudioPlayed] = useState(false);

  useEffect(() => {
    // Play celebration audio
    if (!audioPlayed) {
      const playCelebrationAudio = () => {
        // Create a short celebration sound using Web Audio API
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a simple celebration melody
        const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const duration = 0.15;
        
        frequencies.forEach((freq, index) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sine';
          
          const startTime = audioContext.currentTime + (index * 0.2);
          const endTime = startTime + duration;
          
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);
          
          oscillator.start(startTime);
          oscillator.stop(endTime);
        });
        
        // Add a final triumphant note
        setTimeout(() => {
          const finalOscillator = audioContext.createOscillator();
          const finalGain = audioContext.createGain();
          
          finalOscillator.connect(finalGain);
          finalGain.connect(audioContext.destination);
          
          finalOscillator.frequency.value = 1046.50; // C6
          finalOscillator.type = 'triangle';
          
          const startTime = audioContext.currentTime;
          const endTime = startTime + 0.8;
          
          finalGain.gain.setValueAtTime(0, startTime);
          finalGain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
          finalGain.gain.exponentialRampToValueAtTime(0.01, endTime);
          
          finalOscillator.start(startTime);
          finalOscillator.stop(endTime);
        }, 800);
      };

      try {
        playCelebrationAudio();
        setAudioPlayed(true);
      } catch (error) {
        console.log('Audio context not supported, skipping celebration audio');
        setAudioPlayed(true);
      }
    }

    // Hide effects after 3 seconds and call onComplete
    const timer = setTimeout(() => {
      setShowEffects(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Small delay after effects fade
      }
    }, 3000);

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
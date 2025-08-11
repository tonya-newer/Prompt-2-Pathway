
import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';


interface WelcomePageProps {
  assessmentTitle: string;
  audience: 'individual' | 'business';
  onSubmit: (data: any) => void;
}

export const WelcomePage = ({ assessmentTitle, audience, onSubmit }: WelcomePageProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [showManualPlay, setShowManualPlay] = useState(false);
  const endedAttachedRef = useRef(false);

  // Preload on first user interaction for smoother playback on mobile
  useEffect(() => {
    // Suppress native TTS while on the Welcome screen
    try { (window as any).__P2P_SUPPRESS_TTS__ = true; } catch {}

    const prime = () => {
      try { audioRef.current?.load(); } catch {}
    };
    window.addEventListener('click', prime, { once: true });
    return () => {
      // Cleanup audio if user navigates away early
      const a = audioRef.current;
      if (a) {
        try { a.pause(); } catch {}
        a.currentTime = 0;
      }
      // Re-enable native TTS when leaving Welcome (safety)
      try { (window as any).__P2P_SUPPRESS_TTS__ = false; } catch {}
    };
  }, []);

  const handleStart = async () => {
    try {
      localStorage.setItem('audio-enabled', 'true');
    } catch {}

    const audio = audioRef.current;
    if (!audio) return;

    // Navigate to Q1 only after the welcome message ends
    const onEnded = () => {
      setStatus('');
      setIsStarting(false);
      endedAttachedRef.current = false;
      audio.currentTime = 0;
      // Re-enable native TTS now that we're moving to Q1
      try { (window as any).__P2P_SUPPRESS_TTS__ = false; } catch {}
      onSubmit({});
    };

    if (!endedAttachedRef.current) {
      audio.addEventListener('ended', onEnded, { once: true });
      endedAttachedRef.current = true;
    }

    setIsStarting(true);
    setStatus('Playing welcome message…');

    try {
      await audio.play();
    } catch (err) {
      // Autoplay blocked — show manual play fallback
      setIsStarting(false);
      setShowManualPlay(true);
      setStatus('Tap to play the welcome message, then we’ll begin.');
    }
  };

  const handleManualPlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setShowManualPlay(false);
    setIsStarting(true);
    setStatus('Playing welcome message…');
    try {
      await audio.play();
    } catch {}
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[linear-gradient(145deg,hsl(var(--brand-bg-primary)),hsl(var(--brand-bg-secondary)))] p-6">
      <Card className="w-[min(92vw,860px)] overflow-hidden rounded-[20px] bg-[hsl(var(--brand-card))] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <article className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
          <div
            className="relative min-h-[280px] md:min-h-full bg-cover bg-center"
            style={{ backgroundImage: "url('/lovable-uploads/c7d080b4-8b6e-4094-9ca7-9416122a439f.png')" }}
            role="img"
            aria-label="Abstract navy gradient background"
          >
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--brand-bg-primary)/0),hsl(var(--brand-bg-primary)/0.35))]"
              aria-hidden="true"
            />
          </div>

          <div className="p-7 flex flex-col justify-center text-center md:text-left">
            <div className="self-center md:self-start inline-flex items-center rounded-full bg-[hsl(var(--brand-accent-gold))] text-[hsl(var(--brand-text))] font-bold px-[10px] py-[6px] tracking-[0.06em] mb-2">
              Voice Guided
            </div>
            <h1 className="mb-2 text-[hsl(var(--brand-text))] text-[26px] sm:text-[30px] md:text-[32px] font-extrabold leading-[1.15]">
              Welcome to Your Voice Experience
            </h1>
            <p className="mx-auto md:mx-0 mb-4 max-w-[56ch] text-[hsl(var(--brand-muted))] text-[16px] sm:text-[17px] leading-[1.6]">
              Your personalized assessment uses short voice prompts. Tap Start to begin and listen as we guide you through each step.
            </p>
            <button
              id="startAssessment"
              onClick={handleStart}
              disabled={isStarting}
              aria-busy={isStarting}
              className="inline-block w-full max-w-[360px] rounded-[12px] bg-[hsl(var(--brand-accent-gold))] px-[18px] py-[14px] font-bold uppercase tracking-[0.06em] text-[hsl(var(--brand-text))] shadow-[0_8px_18px_hsl(var(--brand-accent-gold)/0.35)] transition hover:brightness-110 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-accent-gold))] focus-visible:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
              aria-label="Start Assessment"
            >
              {isStarting ? 'Playing…' : 'Start Assessment'}
            </button>

            {/* Status + manual fallback */}
            <div id="welcomeStatus" className="mt-2 text-[14px] text-[hsl(var(--brand-muted))] text-center md:text-left" aria-live="polite">
              {status}
            </div>
            {showManualPlay && (
              <button
                onClick={handleManualPlay}
                className="mt-2 inline-flex items-center justify-center rounded-[10px] border border-[hsl(var(--brand-accent-gold))] bg-transparent px-3 py-2 font-medium text-[hsl(var(--brand-text))] shadow-[0_0_0_0] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-accent-gold))] focus-visible:ring-offset-2"
                aria-label="Play Welcome Message"
              >
                🔊 Tap to play
              </button>
            )}

            {/* Helper text */}
            <div className="mt-3 text-[14px] text-[hsl(var(--brand-muted))]">
              For the best experience, use headphones or speakers.
            </div>

            {/* Welcome audio element */}
            <audio
              id="welcomeAudio"
              preload="metadata"
              crossOrigin="anonymous"
              src="/lovable-uploads/welcome-message_lovable.mp3"
              ref={audioRef}
            />
          </div>
        </article>
      </Card>
    </div>
  );
};

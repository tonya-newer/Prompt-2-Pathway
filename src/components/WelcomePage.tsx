
import { Card } from '@/components/ui/card';

interface WelcomePageProps {
  assessmentTitle: string;
  audience: 'individual' | 'business';
  onSubmit: (data: any) => void;
}

export const WelcomePage = ({ assessmentTitle, audience, onSubmit }: WelcomePageProps) => {
  const handleStart = () => {
    try {
      localStorage.setItem('audio-enabled', 'true');
    } catch {}
    onSubmit({});
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[linear-gradient(145deg,hsl(var(--brand-bg-primary)),hsl(var(--brand-bg-secondary)))] p-6">
      <Card className="w-[min(92vw,720px)] overflow-hidden rounded-[20px] bg-[hsl(var(--brand-card))] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <article>
          <div className="relative h-[150px] bg-[hsl(var(--brand-bg-secondary))]">
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
              <defs>
                <linearGradient id="welcome-grad" x1="0" x2="1">
                  <stop offset="0%" stopColor="hsl(var(--brand-accent-secondary))" />
                  <stop offset="100%" stopColor="hsl(var(--brand-accent-gold))" />
                </linearGradient>
              </defs>
              <path fill="url(#welcome-grad)" d="M0,120 C240,40 360,200 600,120 C840,40 960,200 1200,120 L1200,0 L0,0 Z" />
            </svg>
            <div
              className="absolute right-5 bottom-[18px] rounded-full px-[14px] py-[10px] text-[32px] shadow-[0_6px_14px_rgba(0,0,0,0.2)]"
              style={{ backgroundColor: 'hsl(var(--card) / 0.85)', color: 'hsl(var(--brand-text))' }}
              aria-hidden="true"
            >
              🎧
            </div>
          </div>

          <div className="p-7 text-center">
            <h1 className="mb-3 text-[hsl(var(--brand-text))] text-[26px] sm:text-[32px] md:text-[36px] font-extrabold leading-[1.15]">
              Welcome to Your Voice Experience
            </h1>
            <p className="mx-auto mb-4 max-w-[56ch] text-[hsl(var(--brand-muted))] text-[16px] sm:text-[18px] leading-[1.6]">
              Your personalized assessment uses short voice prompts. Tap Start to begin and listen as we guide you through each step.
            </p>
            <button
              onClick={handleStart}
              className="inline-block w-full max-w-[360px] rounded-[12px] bg-[hsl(var(--brand-accent-gold))] px-[18px] py-[14px] font-bold uppercase tracking-[0.06em] text-[hsl(var(--brand-text))] shadow-[0_8px_18px_hsl(var(--brand-accent-gold)/0.35)] transition hover:brightness-110 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-accent-gold))] focus-visible:ring-offset-2"
              aria-label="Start Assessment"
            >
              Start Assessment
            </button>
            <div className="mt-3 text-[14px] text-[hsl(var(--brand-muted))]">
              For the best experience, use headphones or speakers.
            </div>
          </div>
        </article>
      </Card>
    </div>
  );
};

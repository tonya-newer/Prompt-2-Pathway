
import { Card } from '@/components/ui/card';
import heroImage from '@/assets/welcome-hero.jpg';

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
      <Card className="w-[min(92vw,860px)] overflow-hidden rounded-[20px] bg-[hsl(var(--brand-card))] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <article className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]">
          <div
            className="relative min-h-[280px] md:min-h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
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

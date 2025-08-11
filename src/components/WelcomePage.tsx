
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
      <Card className="w-[min(92vw,720px)] overflow-hidden rounded-[20px] bg-[hsl(var(--brand-card))] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <article>
          <div
            className="relative h-[180px] bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
            role="img"
            aria-label="Abstract navy bokeh background"
          >
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(180deg, hsl(var(--brand-bg-primary) / 0.15), hsl(var(--brand-bg-primary) / 0.55))",
              }}
            />

            <div
              className="absolute left-6 bottom-[18px] grid h-16 w-16 place-items-center rounded-full bg-black/35 text-[hsl(var(--brand-accent-gold))] backdrop-blur-[4px] transition-opacity duration-200 motion-reduce:transition-none border"
              aria-hidden="true"
              style={{ borderColor: "hsl(var(--brand-accent-gold) / 0.6)" }}
            >
              <svg
                className="h-11 w-11"
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="currentColor"
              >
                <path d="M12 3a9 9 0 0 0-9 9v5a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2H5a7 7 0 0 1 14 0h-2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h1a3 3 0 0 0 3-3v-5a9 9 0 0 0-9-9Z" />
              </svg>
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

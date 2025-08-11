
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
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--brand-bg-primary))] to-[hsl(var(--brand-bg-secondary))]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[560px] mx-auto">
          <Card className="p-7 sm:p-7 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.25)] bg-[hsl(var(--brand-card))]">
            <div className="text-center">
              <div className="mx-auto mb-6 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-[hsl(var(--brand-accent-gold))] text-[hsl(var(--brand-accent-gold))] transition-opacity duration-200 motion-reduce:transition-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5l-5 5H3v4h3l5 5V5zM15 9a5 5 0 010 6m2-8a8 8 0 010 10" />
                  </svg>
                </div>
              </div>

              <h1 className="text-[hsl(var(--brand-text))] text-3xl sm:text-[32px] md:text-[36px] font-bold mb-3">
                Welcome to Your Voice Experience
              </h1>
              <p className="text-[hsl(var(--brand-muted))] text-base sm:text-[16px] md:text-[18px] leading-relaxed mb-6">
                Your personalized assessment uses short voice prompts. Tap Start to begin and listen as we guide you through each step.
              </p>

              <button
                onClick={handleStart}
                className="w-full inline-flex items-center justify-center rounded-[12px] py-4 px-6 font-semibold uppercase tracking-wider bg-[hsl(var(--brand-accent-gold))] text-[hsl(var(--brand-text))] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand-accent-gold))] focus-visible:ring-offset-2 shadow-md transition"
                aria-label="Start Assessment"
              >
                Start Assessment
              </button>

              <p className="mt-4 text-xs text-[hsl(var(--brand-muted))]">
                For the best experience, use headphones or speakers.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

import { useSettings } from '../SettingsContext';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenContact?: () => void;
}

export const Footer = ({ onOpenPrivacy, onOpenTerms, onOpenContact }: FooterProps) => {
  const { settings } = useSettings();

  return (
    <footer
      className="py-8 text-center"
      style={{ background: `${settings?.theme?.primaryColor}10` }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-sm text-gray-600 mb-2">
          © {new Date().getFullYear()} {settings?.footer?.companyName || 'Prompt 2 Pathway'}. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <button type="button" onClick={onOpenPrivacy} className="hover:underline cursor-pointer bg-transparent border-none p-0 text-inherit font-inherit">
            Privacy Policy
          </button>
          <button type="button" onClick={onOpenTerms} className="hover:underline cursor-pointer bg-transparent border-none p-0 text-inherit font-inherit">
            Terms of Service
          </button>
          <button type="button" onClick={onOpenContact} className="hover:underline cursor-pointer bg-transparent border-none p-0 text-inherit font-inherit">
            Contact Us
          </button>
        </div>
      </div>
    </footer>
  );
};

import { Link } from 'react-router-dom';
import { useSettings } from '../SettingsContext';

export const Footer = () => {
  const { settings } = useSettings();

  return (
    <footer
      className="py-8 text-center"
      style={{ background: `${settings?.theme?.primaryColor}10` }} // subtle tint of primary
    >
      <div className="max-w-4xl mx-auto px-4">
        <p className="text-sm text-gray-600 mb-2">
          © {new Date().getFullYear()} {settings?.footer?.companyName || 'Prompt 2 Pathway'}. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <Link to="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
};

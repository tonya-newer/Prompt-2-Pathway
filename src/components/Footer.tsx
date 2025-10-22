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
          © {new Date().getFullYear()} {settings?.footer?.companyName}. All rights reserved.
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <a
            href="/privacy"
            className="hover:underline"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="/contact"
            className="hover:underline"
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

import { useSettings } from "@/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail } from "lucide-react";

interface ContactUsProps {
  open: boolean;
  onClose: () => void;
}

const ContactUs = ({ open, onClose }: ContactUsProps) => {
  const { settings } = useSettings();
  const contactEmail =
    settings?.footer?.contactEmail?.trim() || "support@example.com";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact Us</DialogTitle>
        </DialogHeader>
        <a
          href={`mailto:${contactEmail}`}
          className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
        >
          <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
          <span className="text-primary hover:underline font-medium">
            {contactEmail}
          </span>
        </a>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUs;

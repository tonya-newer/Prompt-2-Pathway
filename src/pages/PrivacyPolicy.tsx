import { useSettings } from "@/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrivacyPolicyProps {
  open: boolean;
  onClose: () => void;
}

const PrivacyPolicy = ({ open, onClose }: PrivacyPolicyProps) => {
  const { settings, loading } = useSettings();
  const content = settings?.footer?.privacyPolicy?.trim() || "";
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
          <DialogTitle className="text-2xl">Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 pt-2">
          <div className="pr-4 prose prose-slate max-w-none">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : paragraphs.length === 0 ? (
              <p className="text-gray-500">
                No privacy policy content has been set in settings yet.
              </p>
            ) : (
              paragraphs.map((para, i) => {
                const isBold =
                  para.startsWith("**") && para.endsWith("**");
                const text = isBold ? para.slice(2, -2) : para;
                return (
                  <p
                    key={i}
                    className={
                      isBold
                        ? "font-semibold text-gray-900 mt-4 mb-1"
                        : "text-gray-600 mb-3"
                    }
                  >
                    {text}
                  </p>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;

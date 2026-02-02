import { Link } from "react-router-dom";
import { useSettings } from "@/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";

const ContactUs = () => {
  const { settings } = useSettings();
  const contactEmail = settings?.footer?.contactEmail?.trim() || "support@example.com";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <Mail className="h-5 w-5 text-muted-foreground shrink-0" />
              <span className="text-primary hover:underline font-medium">{contactEmail}</span>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;

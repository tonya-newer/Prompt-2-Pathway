import { Link } from "react-router-dom";
import { useSettings } from "@/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const { settings, loading } = useSettings();
  const content = settings?.footer?.privacyPolicy?.trim() || '';
  const paragraphs = content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : paragraphs.length === 0 ? (
              <p className="text-gray-500">No privacy policy content has been set in settings yet.</p>
            ) : (
              paragraphs.map((para, i) => {
                const isBold = para.startsWith("**") && para.endsWith("**");
                const text = isBold ? para.slice(2, -2) : para;
                return (
                  <p
                    key={i}
                    className={isBold ? "font-semibold text-gray-900 mt-4 mb-1" : "text-gray-600 mb-3"}
                  >
                    {text}
                  </p>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

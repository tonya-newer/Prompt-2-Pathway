import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { fetchSettings, saveSettings } from "@/store/settingsSlice";
import type { RootState } from "@/store";
import { Upload, X } from 'lucide-react';

export const Settings = () => {
  const dispatch = useDispatch<any>();
  const { toast } = useToast();
  const settingsFromStore = useSelector((state: RootState) => state.settings.data);

  const [form, setForm] = useState({
    platformName: "",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    accentColor: "#007bff",
    whiteLabel: false,
    logo: '',
    favicon: '',
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settingsFromStore) {
      setForm({ ...form, ...settingsFromStore });
    }
  }, [settingsFromStore]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogoImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setForm({
          ...form,
          logo: imageUrl
        });
        toast({
          title: "Logo Image Uploaded",
          description: "Logo image has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setForm({
          ...form,
          favicon: imageUrl
        });
        toast({
          title: "Favicon Image Uploaded",
          description: "Favicon image has been updated.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null) formData.append(key, val as any);
      });
      await dispatch(saveSettings(formData)).unwrap();
      toast({
        title: "Settings Saved",
        description: "Platform branding and white-label settings updated successfully.",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to save settings",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center py-3">
        <h3 className="text-lg font-semibold">Platform Settings</h3>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>

      <div className="grid gap-6">
        {/* Branding & White-Label */}
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Branding & White-Label</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                name="platformName"
                value={form.platformName}
                onChange={handleChange}
                placeholder="Enter platform name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="logo-upload">Logo Image</Label>
              <div className="space-y-4">
                {form.logo && (
                  <div className="relative max-w-md">
                    <img 
                      src={form.logo} 
                      alt="Logo preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({...form, logo: ''})}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {form.logo ? 'Change Image' : 'Upload Image'}
                </Button>
                <span className="text-sm text-gray-500">
                  {form.logo ? 'Image uploaded - will display vertically' : 'Recommended: 400x600px or similar vertical format'}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="favicon-upload">Favicon / App Icon</Label>
              <div className="space-y-4">
                {form.favicon && (
                  <div className="relative max-w-md">
                    <img 
                      src={form.favicon} 
                      alt="Favicon preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({...form, favicon: ''})}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Input
                  id="favicon-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFaviconImageUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('favicon-upload')?.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {form.favicon ? 'Change Image' : 'Upload Image'}
                </Button>
                <span className="text-sm text-gray-500">
                  {form.favicon ? 'Image uploaded - will display vertically' : 'Recommended: 400x600px or similar vertical format'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  value={form.primaryColor}
                  onChange={handleChange}
                  className="mt-2 w-full h-10 p-0 border-none"
                />
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="color"
                  value={form.secondaryColor}
                  onChange={handleChange}
                  className="mt-2 w-full h-10 p-0 border-none"
                />
              </div>

              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <Input
                  id="accentColor"
                  name="accentColor"
                  type="color"
                  value={form.accentColor}
                  onChange={handleChange}
                  className="mt-2 w-full h-10 p-0 border-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="whiteLabel"
                name="whiteLabel"
                checked={form.whiteLabel}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, whiteLabel: Boolean(checked) }))
                }
              />
              <Label htmlFor="whiteLabel" className="select-none">
                White-Label (hide Prompt 2 Pathway branding)
              </Label>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

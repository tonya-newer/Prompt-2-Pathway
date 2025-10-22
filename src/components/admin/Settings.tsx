import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/components/ui/use-toast";
import { fetchSettings, saveSettings } from "@/store/settingsSlice";
import type { RootState } from "@/store";
import { Upload, X } from 'lucide-react';

export const Settings = () => {
  const dispatch = useDispatch<any>();
  const { toast } = useToast();
  const settingsFromStore = useSelector((state: RootState) => state.settings.data);

  const [form, setForm] = useState({
    platform: {
      name: "",
      logo: "",
      favicon: "",
      whiteLabel: false
    },
    interactionPage: {
      layout: 'single',
      image1: "",
      image2: "",
      heading: "",
      subHeading: "",
      buttonText: ""
    },
    welcomePage: {
      background: "",
      heading: "",
      headingColor: "",
      subHeading: "",
      subHeadingColor: ""
    },
    resultPage: {
      category1: "Readiness",
      category2: "Confidence",
      category3: "Clarity",
      bookingLink: "https://tidycal.com/newerconsulting"
    },
    theme: {
      primaryColor: "#000000",
      secondaryColor: "#ffffff",
      accentColor: "#007bff",
    },
    footer: {
      companyName: "",
      privacyPolicy: "",
      termsOfService: ""
    }
  });

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settingsFromStore) {
      setForm({ ...form, ...settingsFromStore });
    }
  }, [settingsFromStore]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
    name?: string
  ) => {
    let fieldName: string;
    let value: string | boolean;
  
    if (typeof e === "string") {
      // Case: Select component
      if (!name) return; // name must be passed for selects
      fieldName = name;
      value = e;
    } else {
      // Case: Input or Textarea
      const target = e.target;
      fieldName = target.name;
      value =
        (target as HTMLInputElement).type === "checkbox"
          ? (target as HTMLInputElement).checked
          : target.value;
    }
  
    setForm((prev) => {
      const keys = fieldName.split(".");
      const newState = { ...prev };
      let temp = newState;
  
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          temp[key] = value;
        } else {
          temp[key] = { ...temp[key] };
          temp = temp[key];
        }
      });
  
      return newState;
    });
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, fieldPath: string) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
  
      setForm(prev => {
        const keys = fieldPath.split('.');
        let updated = { ...prev };
        let temp = updated;
  
        for (let i = 0; i < keys.length - 1; i++) {
          temp[keys[i]] = { ...temp[keys[i]] };
          temp = temp[keys[i]];
        }
  
        temp[keys[keys.length - 1]] = imageUrl;
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async () => {
    try {
      await dispatch(saveSettings(form)).unwrap();
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
        <h3 className="text-lg font-semibold">Settings</h3>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>

      <div className="grid gap-6">
        <Card className="p-6">
          <h4 className="text-lg font-semibold mb-4">Platform</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="platformName">Platform Name</Label>
              <Input
                id="platformName"
                name="platform.name"
                value={form.platform.name}
                onChange={handleChange}
                placeholder="Enter Your Platform Name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="logo-upload">Logo Image</Label>
              <div className="space-y-4">
                {form.platform.logo && (
                  <div className="relative max-w-md">
                    <img 
                      src={form.platform.logo} 
                      alt="Logo preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({
                        ...form,
                        platform: {
                          ...form.platform,
                          logo: ''
                        }
                      })}
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
                  onChange={(e) => handleImageUpload(e, "platform.logo")}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {form.platform.logo ? 'Change Image' : 'Upload Image'}
                </Button>
                <span className="text-sm text-gray-500">
                  {form.platform.logo ? 'Image uploaded - will display vertically' : 'Recommended: 400x600px or similar vertical format'}
                </span>
              </div>
            </div>
            <div>
              <Label htmlFor="favicon-upload">Favicon / App Icon</Label>
              <div className="space-y-4">
                {form.platform.favicon && (
                  <div className="relative max-w-md">
                    <img 
                      src={form.platform.favicon} 
                      alt="Favicon preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({
                        ...form, 
                        platform: {
                          ...form.platform,
                          favicon: ''
                        }
                      })}
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
                  onChange={(e) => handleImageUpload(e, "platform.favicon")}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('favicon-upload')?.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {form.platform.favicon ? 'Change Image' : 'Upload Image'}
                </Button>
                <span className="text-sm text-gray-500">
                  {form.platform.favicon ? 'Image uploaded - will display vertically' : 'Recommended: 400x600px or similar vertical format'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <Input
                  id="primaryColor"
                  name="theme.primaryColor"
                  type="color"
                  value={form.theme.primaryColor}
                  onChange={handleChange}
                  className="mt-2 w-full h-10 p-0 border-none"
                />
              </div>

              <div>
                <Label htmlFor="secondaryColor">Secondary Color</Label>
                <Input
                  id="secondaryColor"
                  name="theme.secondaryColor"
                  type="color"
                  value={form.theme.secondaryColor}
                  onChange={handleChange}
                  className="mt-2 w-full h-10 p-0 border-none"
                />
              </div>

              <div>
                <Label htmlFor="accentColor">Accent Color</Label>
                <Input
                  id="accentColor"
                  name="theme.accentColor"
                  type="color"
                  value={form.theme.accentColor}
                  onChange={handleChange}
                  className="mt-2 w-full h-10 p-0 border-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id="whiteLabel"
                name="platform.whiteLabel"
                checked={form.platform.whiteLabel}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({
                    ...prev,
                    platform: {
                      ...prev.platform,
                      whiteLabel: Boolean(checked) 
                    }
                  }))
                }
              />
              <Label htmlFor="whiteLabel" className="select-none">
                White-Label (hide Prompt 2 Pathway branding)
              </Label>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h4 className="text-lg font-semibold">Interaction Page</h4>
          <div>
            <Label htmlFor="interaction-layout">Background Image Layout</Label>
            <Select
              value={form.interactionPage.layout} 
              onValueChange={(val) => handleChange(val, "interactionPage.layout")}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="dual">Dual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="logo-upload">Background Image 1</Label>
              <div className="space-y-4">
                {form.interactionPage.image1 && (
                  <div className="relative max-w-md">
                    <img 
                      src={form.interactionPage.image1} 
                      alt="Image 1 preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({
                        ...form,
                        interactionPage: {
                          ...form.interactionPage,
                          image1: ''
                        }
                      })}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Input
                  id="interaction-image-1-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "interactionPage.image1")}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('interaction-image-1-upload')?.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {form.interactionPage.image1 ? 'Change Image' : 'Upload Image'}
                </Button>
                <span className="text-sm text-gray-500">
                  {form.interactionPage.image1 ? 'Image uploaded - will display vertically' : 'Recommended: 400x600px or similar vertical format'}
                </span>
              </div>
            </div>
            { form.interactionPage.layout == 'dual' && 
            <div>
              <Label htmlFor="logo-upload">Background Image 2</Label>
              <div className="space-y-4">
                {form.interactionPage.image2 && (
                  <div className="relative max-w-md">
                    <img 
                      src={form.interactionPage.image2} 
                      alt="Image 1 preview"
                      className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setForm({
                        ...form,
                        interactionPage: {
                          ...form.interactionPage,
                          image2: ''
                        }
                      })}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <Input
                  id="interaction-image-2-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "interactionPage.image2")}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('interaction-image-2-upload')?.click()}
                  className="flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {form.interactionPage.image2 ? 'Change Image' : 'Upload Image'}
                </Button>
                <span className="text-sm text-gray-500">
                  {form.interactionPage.image2 ? 'Image uploaded - will display vertically' : 'Recommended: 400x600px or similar vertical format'}
                </span>
              </div>
            </div>
            }
          </div>
          
          <div>
            <Label htmlFor="interaction-heading-text">Heading Text</Label>
            <Input
              id="interaction-heading-text"
              name="interactionPage.heading"
              value={form.interactionPage.heading}
              onChange={handleChange}
              placeholder="Enter Heading Text"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="interaction-subheading-text">Subheading Text</Label>
            <Input
              id="interaction-subheading-text"
              name="interactionPage.subHeading"
              value={form.interactionPage.subHeading}
              onChange={handleChange}
              placeholder="Enter Subheading Text"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="interaction-button-text">Button Text</Label>
            <Input
              id="interaction-button-text"
              name="interactionPage.buttonText"
              value={form.interactionPage.buttonText}
              onChange={handleChange}
              placeholder="Enter Button Text"
              className="mt-2"
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h4 className="text-lg font-semibold">Welcome Page</h4>
          <div className="my-4">
            <Label htmlFor="logo-upload">Background Image</Label>
            <div className="space-y-4">
              {form.welcomePage.background && (
                <div className="relative max-w-md">
                  <img 
                    src={form.welcomePage.background} 
                    alt="Logo preview"
                    className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({
                      ...form,
                      welcomePage: {
                        ...form.welcomePage,
                        background: ''
                      }
                    })}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Input
                id="welcome-background-upload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, "welcomePage.background")}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('welcome-background-upload')?.click()}
                className="flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                {form.welcomePage.background ? 'Change Image' : 'Upload Image'}
              </Button>
              <span className="text-sm text-gray-500">
                {form.welcomePage.background ? 'Image uploaded - will display vertically' : 'Recommended: 400x600px or similar vertical format'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="welcome-heading-text">Heading Text</Label>
              <Input
                id="welcome-heading-text"
                name="welcomePage.heading"
                value={form.welcomePage.heading}
                onChange={handleChange}
                placeholder="Enter Heading Text"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="welcome-heading-color">Heading Color</Label>
              <Input
                id="welcome-heading-color"
                name="welcomePage.headingColor"
                type="color"
                value={form.welcomePage.headingColor}
                onChange={handleChange}
                className="mt-2 w-full h-10 p-0 border-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="welcome-subheading-text">Subheading Text</Label>
              <Input
                id="welcome-subheading-text"
                name="welcomePage.subHeading"
                value={form.welcomePage.subHeading}
                onChange={handleChange}
                placeholder="Enter Subheading Text"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="welcome-subheading-color">Subheading Color</Label>
              <Input
                id="welcome-subheading-color"
                name="welcomePage.subHeadingColor"
                type="color"
                value={form.welcomePage.subHeadingColor}
                onChange={handleChange}
                className="mt-2 w-full h-10 p-0 border-none"
              />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 space-y-4">
          <h4 className="text-lg font-semibold">Result Page</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="result-category1">Result Category 1</Label>
              <Input
                id="result-category1"
                name="resultPage.category1"
                value={form.resultPage.category1}
                onChange={handleChange}
                placeholder="Enter Result Category 1"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="result-category1">Result Category 2</Label>
              <Input
                id="result-category2"
                name="resultPage.category2"
                value={form.resultPage.category2}
                onChange={handleChange}
                placeholder="Enter Result Category 2"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="result-category1">Result Category 3</Label>
              <Input
                id="result-category3"
                name="resultPage.category3"
                value={form.resultPage.category3}
                onChange={handleChange}
                placeholder="Enter Result Category 3"
                className="mt-2"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="result-booking-link">Booking Call Link</Label>
            <Input
              id="result-booking-link"
              name="resultPage.bookingLink"
              value={form.resultPage.bookingLink}
              onChange={handleChange}
              placeholder="Enter Your Booking Link"
              className="mt-2"
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h4 className="text-lg font-semibold">Footer</h4>
          <div>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              name="footer.companyName"
              value={form.footer.companyName}
              onChange={handleChange}
              placeholder="Enter Your Company Name"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="privacy-policy">Privacy Policy</Label>
            <Textarea
              id="privacy-policy"
              name="footer.privacyPolicy"
              value={form.footer.privacyPolicy}
              onChange={handleChange}
              placeholder="Enter Your Privacy Policy"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="terms-of-service">Terms Of Service</Label>
            <Textarea
              id="terms-of-service"
              name="footer.termsOfService"
              value={form.footer.termsOfService}
              onChange={handleChange}
              placeholder="Enter Your Terms Of Service"
              className="mt-2"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

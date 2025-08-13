import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { VoicePlayer } from '@/components/VoicePlayer';
import { useToast } from "@/hooks/use-toast";
import { leadStorageService } from '@/services/leadStorage';

export let celebrationAudio: HTMLAudioElement | null = null;

const ContactForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ageRange: '',
    gender: '',
    source: '',
    bonusTools: false,
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to continue';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "All required fields must be completed",
        variant: "destructive",
      });
      return;
    }

    try {
      // // Store contact information in multiple places for reliability
      // localStorage.setItem('contact-info', JSON.stringify(formData));
      localStorage.setItem('user-info', JSON.stringify(formData));
      
      // Get assessment results for lead storage
      const assessmentResults = localStorage.getItem('assessment-results');
      const assessmentTitle = localStorage.getItem('assessment-title');
      
      if (assessmentResults && assessmentTitle) {
        const leadData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || '',
          ageRange: formData.ageRange || '',
          gender: formData.gender || '',
          source: formData.source || 'direct',
          audience: 'individual'
        };
        
        const results = JSON.parse(assessmentResults);
        leadStorageService.storeLead(leadData, results, assessmentTitle);
        console.log('Lead data stored successfully');
      }

      toast({
        title: "Thank you!",
        description: "Your information has been saved. Redirecting to your results...",
      });

      // Create and preload the celebration audio
      celebrationAudio = new Audio('/assets/celebration-audio.mp3');
      celebrationAudio.volume = 0.7;
      celebrationAudio.preload = 'auto';
      celebrationAudio.setAttribute('playsinline', 'true');
      celebrationAudio.autoplay = true;
      celebrationAudio.muted = false;
      celebrationAudio.preload = 'auto';

      // Navigate to results page immediately for better mobile experience
      console.log('Navigating to results page...');
      navigate('/results', { replace: true });
    } catch (error) {
      console.error('Error saving contact information:', error);
      toast({
        title: "Error",
        description: "There was an issue saving your information. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const voiceScript = "Great job completing your assessment! Now, let's get your personalized results sent directly to you. Please share a few quick details so we can deliver your custom insights and bonus tools right to your inbox.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Tell Us Where to Send Your Personalized Results 👇
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              This helps us deliver your custom results + bonus tips straight to your inbox.
            </p>
            <p className="text-base text-gray-600">
              You'll also get exclusive tools to help you take action faster and with clarity.
            </p>
          </div>

          {/* Voice Player */}
          <VoicePlayer
            text={voiceScript}
            autoPlay={true}
            customVoiceType="contact-form"
            className="mb-8"
          />

          {/* Contact Form */}
          <Card className="p-6 sm:p-8 bg-white shadow-xl rounded-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-base font-medium text-gray-900">
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="lastName" className="text-base font-medium text-gray-900">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-base font-medium text-gray-900">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-base font-medium text-gray-900">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1"
                  placeholder="Enter your phone number (optional)"
                />
              </div>

              {/* Age Range */}
              <div>
                <Label className="text-base font-medium text-gray-900">
                  Age Range
                </Label>
                <Select onValueChange={(value) => handleInputChange('ageRange', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select your age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-24">18–24</SelectItem>
                    <SelectItem value="25-34">25–34</SelectItem>
                    <SelectItem value="35-44">35–44</SelectItem>
                    <SelectItem value="45-54">45–54</SelectItem>
                    <SelectItem value="55-64">55–64</SelectItem>
                    <SelectItem value="65+">65+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender */}
              <div>
                <Label className="text-base font-medium text-gray-900">
                  Gender (Optional)
                </Label>
                <Select onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-Binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer Not to Say</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source */}
              <div>
                <Label className="text-base font-medium text-gray-900">
                  How Did You Find Us?
                </Label>
                <Select onValueChange={(value) => handleInputChange('source', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="social-media">Social Media</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Single Checkbox for Both Consent and Bonus Tools */}
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked as boolean)}
                  className="mt-0.5 flex-shrink-0"
                />
                <Label htmlFor="agreedToTerms" className="text-base text-gray-700 leading-relaxed cursor-pointer">
                  Yes! I want bonus tools to help me take action on my results.
                </Label>
              </div>
              {errors.agreedToTerms && (
                <p className="text-red-500 text-sm mt-1">{errors.agreedToTerms}</p>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue to My Results →
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
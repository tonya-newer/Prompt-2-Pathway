
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mic, Shield, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LeadCaptureFormProps {
  onSubmit: (data: any) => void;
  audience: string;
}

export const LeadCaptureForm = ({ onSubmit, audience }: LeadCaptureFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ageRange: '',
    agreedToTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disposableEmailDomains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com', 'mailinator.com'];
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    
    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableEmailDomains.includes(domain)) {
      return 'Please use a permanent email address';
    }
    
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    // Validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }
    if (!formData.ageRange) newErrors.ageRange = 'Please select your age range';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'Please agree to continue';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      const submissionData = {
        ...formData,
        audience,
        submissionDate: new Date().toISOString(),
        source: 'direct'
      };
      
      toast({
        title: "Information Captured",
        description: "Thank you! Let's begin your personalized assessment.",
      });
      
      onSubmit(submissionData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const audienceTitle = audience === 'business' ? 'Business Growth Flow' : 'Personal Clarity Flow';
  const audienceDescription = audience === 'business' 
    ? 'Assess your business readiness and discover growth opportunities'
    : 'Discover your path to personal and professional clarity';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">{audienceTitle}</h1>
            <p className="text-gray-600 text-sm">{audienceDescription}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                  placeholder="Your first name"
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
              </div>
              
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                  placeholder="Your last name"
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="ageRange">Age Range *</Label>
              <Select value={formData.ageRange} onValueChange={(value) => handleInputChange('ageRange', value)}>
                <SelectTrigger className={errors.ageRange ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55-64">55-64</SelectItem>
                  <SelectItem value="65+">65+</SelectItem>
                </SelectContent>
              </Select>
              {errors.ageRange && <p className="text-red-500 text-xs mt-1">{errors.ageRange}</p>}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Privacy Notice</p>
                  <p>
                    By continuing, you agree that your information will be stored in our system for 
                    personalized insights and optional follow-up purposes. 
                    <button type="button" className="underline ml-1 hover:text-blue-900">
                      You may opt out at any time here.
                    </button>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreedToTerms', checked as boolean)}
                />
                <Label htmlFor="agreedToTerms" className="text-sm text-blue-800">
                  I understand and agree to continue
                </Label>
              </div>
              {errors.agreedToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreedToTerms}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3"
              size="lg"
            >
              <UserCheck className="h-5 w-5 mr-2" />
              Begin My VoiceFlow™ Assessment
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

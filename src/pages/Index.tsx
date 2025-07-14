
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Mic, Brain, Users, TrendingUp, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { assessmentTemplates } from '@/data/assessmentTemplates';

const Index = () => {
  const navigate = useNavigate();

  const handleStartJourney = () => {
    // Navigate to the first available assessment
    if (assessmentTemplates.length > 0) {
      navigate(`/assessment/${assessmentTemplates[0].id}`);
    }
  };

  const handlePreviewVoice = () => {
    // For now, scroll to the features section to showcase voice capabilities
    // In a full implementation, this would open a voice preview modal
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
    // You can replace this with actual voice preview functionality
    alert('Voice preview functionality - this would demonstrate our voice-guided experience');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to VoiceCard
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Experience voice-guided clarity assessments that reveal insights about your path forward
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" onClick={handleStartJourney}>
              <Play className="mr-2 h-5 w-5" />
              Start Your Journey
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4" onClick={handlePreviewVoice}>
              <Mic className="mr-2 h-5 w-5" />
              Preview Voice Experience
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features-section" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why VoiceCard?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our voice-guided assessments provide deeper insights through human connection and personalized experiences
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Deep Insights</h3>
            <p className="text-gray-600">
              Uncover meaningful patterns and clarity about your personal or business direction
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Voice-Guided</h3>
            <p className="text-gray-600">
              Experience a human touch with professionally crafted voice narration throughout
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized</h3>
            <p className="text-gray-600">
              Tailored experiences for individuals and business owners with relevant insights
            </p>
          </Card>
        </div>
      </section>

      {/* Assessment Templates */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Assessment
          </h2>
          <p className="text-lg text-gray-600">
            Select from our curated collection of professional assessments
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assessmentTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {template.image && (
                <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-500 relative overflow-hidden">
                  <img 
                    src={template.image} 
                    alt={template.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={template.audience === 'business' ? 'default' : 'secondary'}>
                    {template.audience}
                  </Badge>
                  <div className="flex items-center text-sm text-yellow-600">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-2">{template.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{template.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{template.questions.length} questions</span>
                  <span>~{Math.ceil(template.questions.length * 0.75)} min</span>
                </div>
                <Link to={`/assessment/${template.id}`}>
                  <Button className="w-full">
                    <Play className="mr-2 h-4 w-4" />
                    Start Assessment
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Thousands</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">12,547</div>
              <div className="text-blue-100">Assessments Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-blue-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">VoiceCard</h3>
          <p className="text-gray-400 mb-6">
            Empowering clarity through voice-guided assessments
          </p>
          <div className="flex justify-center space-x-6">
            <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
              Admin Dashboard
            </Link>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © 2025 VoiceCard. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

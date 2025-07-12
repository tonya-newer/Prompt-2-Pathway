
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, Users, User, TrendingUp, Brain, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const assessmentTypes = [
    {
      id: 'individual',
      title: 'Personal Clarity Flow',
      description: 'Discover your path to personal and professional clarity',
      icon: User,
      color: 'from-purple-500 to-pink-500',
      audience: 'individual'
    },
    {
      id: 'business',
      title: 'Business Growth Flow',
      description: 'Assess your business readiness and growth opportunities',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      audience: 'business'
    }
  ];

  const features = [
    {
      icon: Mic,
      title: 'Voice-Guided Experience',
      description: 'Interactive voice narration guides you through each step'
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Receive personalized recommendations based on your responses'
    },
    {
      icon: Target,
      title: 'Actionable Results',
      description: 'Get your Clarity Snapshot with specific next steps'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Mic className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VoiceFlow™
              </h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="hidden md:flex"
            >
              Admin Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Discover Your Path Forward with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}Voice-Guided Clarity
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Experience a revolutionary approach to self-discovery and business assessment. 
            Our AI-powered voice companion guides you through personalized insights 
            that reveal your next breakthrough moment.
          </p>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <feature.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Selection */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-4">Choose Your VoiceFlow™ Experience</h3>
          <p className="text-gray-600 text-center mb-12">
            Select the path that resonates with your current journey
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {assessmentTypes.map((type) => (
              <Card 
                key={type.id}
                className="relative overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/assessment/${type.audience}`)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative p-8 text-center">
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${type.color} mb-6`}>
                    <type.icon className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4">{type.title}</h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">{type.description}</p>
                  <Button className={`bg-gradient-to-r ${type.color} text-white border-0 hover:scale-105 transition-transform`}>
                    Start Your Journey
                    <Mic className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="bg-white/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm text-gray-600 leading-relaxed">
              <strong>Your Privacy Matters:</strong> By continuing, you agree that your information will be stored in our system for personalized insights and optional follow-up. 
              <button className="text-blue-600 hover:underline ml-1">You may opt out at any time here.</button>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">VoiceFlow™</span>
          </div>
          <p className="text-gray-400">
            Empowering clarity through voice-guided insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;


import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Share2, Mic, TrendingUp, Target, Lightbulb, ArrowLeft } from 'lucide-react';
import { VoicePlayer } from '@/components/VoicePlayer';
import { LeadData, AssessmentResults } from '@/types/assessment';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { leadData, answers, results, template }: {
    leadData: LeadData;
    answers: Record<number, any>;
    results: AssessmentResults;
    template: string;
  } = location.state || {};

  if (!results) {
    navigate('/');
    return null;
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-500' };
    if (score >= 40) return { label: 'Fair', color: 'bg-yellow-500' };
    return { label: 'Needs Attention', color: 'bg-red-500' };
  };

  const overallLabel = getScoreLabel(results.overallScore);

  const handleDownload = () => {
    const content = `
VoiceCard Clarity Snapshot
${template} Assessment Results

Overall Score: ${results.overallScore}/100 (${overallLabel.label})

Category Breakdown:
- Readiness: ${results.categoryScores.readiness}/100
- Confidence: ${results.categoryScores.confidence}/100  
- Clarity: ${results.categoryScores.clarity}/100

Key Insights:
${results.insights.map((insight: string, i: number) => `${i + 1}. ${insight}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voicecard-clarity-snapshot.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Distinct voice guide message - warm and conversational
  const voiceScript = `Hello ${leadData?.firstName}, and congratulations on completing your VoiceCard assessment! This is truly an accomplishment worth celebrating. Taking the time for this kind of self-reflection shows real commitment to your growth. Your overall clarity score of ${results.overallScore} out of 100 is a meaningful indicator of where you stand today. But what's even more valuable are the personalized insights we've discovered specifically for your journey. These aren't generic recommendations - they're tailored insights based on your unique responses. I encourage you to take your time reviewing these insights, as they could be the key to unlocking your next breakthrough.`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Take Another Assessment
            </Button>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome & Voice Player */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Your VoiceCard 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Clarity Snapshot
              </span>
            </h1>
            
            {/* Enhanced Congratulations Message - Even Larger and More Prominent */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-12 mb-8 shadow-lg">
              <div className="text-center">
                <div className="text-8xl mb-6">🎉</div>
                <h2 className="text-6xl font-black text-green-800 mb-4 tracking-tight">
                  CONGRATULATIONS!
                </h2>
                <p className="text-4xl font-bold text-green-700 mb-3">
                  {leadData?.firstName?.toUpperCase()}, YOU DID IT!
                </p>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  Assessment Complete - Your Personalized Results Are Ready!
                </p>
                <div className="bg-white/80 rounded-lg p-6 mt-6">
                  <p className="text-xl font-semibold text-gray-800">
                    You've successfully completed your {template} assessment. 
                    Your detailed insights and actionable next steps are outlined below.
                  </p>
                </div>
              </div>
            </div>
            
            <VoicePlayer 
              text={voiceScript}
              autoPlay={false}
              className="mb-8"
            />
          </div>

          {/* Overall Score */}
          <Card className="p-8 mb-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <div className="mb-4">
              <div className="text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {results.overallScore}
              </div>
              <div className="text-2xl text-gray-600">out of 100</div>
            </div>
            <Badge className={`${overallLabel.color} text-white text-lg px-4 py-2 mb-4`}>
              {overallLabel.label}
            </Badge>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This score reflects your current position across key areas we assessed. 
              Remember, this is a starting point for your journey forward.
            </p>
          </Card>

          {/* Category Breakdown */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {Object.entries(results.categoryScores).map(([category, score]) => {
              const categoryLabel = getScoreLabel(score as number);
              return (
                <Card key={category} className="p-6">
                  <div className="flex items-center mb-4">
                    {category === 'readiness' && <Target className="h-6 w-6 mr-3 text-blue-600" />}
                    {category === 'confidence' && <TrendingUp className="h-6 w-6 mr-3 text-green-600" />}
                    {category === 'clarity' && <Lightbulb className="h-6 w-6 mr-3 text-purple-600" />}
                    <h3 className="font-semibold text-lg capitalize">{category}</h3>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between mb-2">
                      <span className="text-2xl font-bold">{score}</span>
                      <Badge variant="outline" className={categoryLabel.color.replace('bg-', 'border-') + ' border-2'}>
                        {categoryLabel.label}
                      </Badge>
                    </div>
                    <Progress value={score as number} className="h-3" />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Key Insights */}
          <Card className="p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Lightbulb className="h-6 w-6 mr-3 text-yellow-500" />
              Your Personalized Insights
            </h2>
            <div className="space-y-4">
              {results.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Call to Action - Fixed visibility */}
          <Card className="p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Explore More?</h3>
            <p className="mb-6 text-blue-100">
              Your journey doesn't end here. We're here to support your continued growth, 
              but only if you're open to exploring what's possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                Schedule a Clarity Call
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <span className="font-medium">Access Additional Resources</span>
              </Button>
            </div>
            <p className="text-xs text-blue-200 mt-4">
              No pressure - we'll only follow up if you indicate you'd like us to.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;

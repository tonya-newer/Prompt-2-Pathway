import { useLocation, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, Share2, Mic, TrendingUp, Target, Lightbulb, ArrowLeft } from 'lucide-react';
import { VoicePlayer } from '@/components/VoicePlayer';
import { LeadData, AssessmentResults } from '@/types/assessment';
import { leadStorageService } from '@/services/leadStorage';
import { useEffect } from 'react';

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

  // Store the lead data when results are displayed
  useEffect(() => {
    if (leadData && results && template) {
      leadStorageService.storeLead(leadData, results, template);
      console.log('Assessment completed and stored:', { leadData, results, template });
    }
  }, [leadData, results, template]);

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

  // Enhanced voice script message
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
              <span className="hidden sm:inline">Take Another Assessment</span>
              <span className="sm:hidden">Back</span>
            </Button>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Button variant="outline" onClick={handleDownload} size="sm">
                <Download className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome & Enhanced Voice Player */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-4">
              Your VoiceCard 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}Clarity Snapshot
              </span>
            </h1>
            
            {/* Mobile-Optimized Congratulations Message */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 sm:border-4 border-green-400 rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 mb-6 sm:mb-8 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="text-center">
                <div className="text-3xl sm:text-5xl lg:text-7xl mb-3 sm:mb-6">🎉</div>
                <h2 className="text-xl sm:text-3xl lg:text-5xl font-black text-green-800 mb-2 sm:mb-4 tracking-tight drop-shadow-lg">
                  CONGRATULATIONS!
                </h2>
                <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-700 mb-2 sm:mb-3">
                  {leadData?.firstName?.toUpperCase()}, YOU DID IT!
                </p>
                <p className="text-sm sm:text-lg lg:text-xl font-bold text-green-600 mb-3 sm:mb-4">
                  Assessment Complete - Your Results Are Ready!
                </p>
                <div className="bg-white/90 rounded-lg sm:rounded-xl p-3 sm:p-6 mt-3 sm:mt-6 shadow-lg">
                  <p className="text-xs sm:text-base lg:text-lg font-semibold text-gray-800 leading-relaxed">
                    You've successfully completed your {template} assessment. 
                    Your detailed insights and actionable next steps are outlined below.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mobile-Optimized Voice Guide Section */}
            <div className="mb-6 sm:mb-8">
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 sm:border-4 border-purple-300 rounded-xl p-4 sm:p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
                  <div className="bg-purple-600 p-3 sm:p-4 rounded-full mb-3 sm:mb-0 sm:mr-4">
                    <Mic className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-purple-900 mb-2">🎧 YOUR PERSONALIZED VOICE MESSAGE</h3>
                    <p className="text-sm sm:text-base text-purple-700 font-bold">Press play to hear a summary of your results!</p>
                    <p className="text-xs sm:text-sm text-purple-600 mt-1">This is your unique VoiceCard experience - tailored just for you!</p>
                  </div>
                </div>
                <VoicePlayer 
                  text={voiceScript}
                  autoPlay={false}
                  className="bg-white/90 shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="p-6 sm:p-8 mb-6 sm:mb-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-xl">
            <div className="mb-4">
              <div className="text-4xl sm:text-6xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {results.overallScore}
              </div>
              <div className="text-lg sm:text-2xl text-gray-600">out of 100</div>
            </div>
            <Badge className={`${overallLabel.color} text-white text-sm sm:text-lg px-3 sm:px-4 py-1 sm:py-2 mb-4`}>
              {overallLabel.label}
            </Badge>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              This score reflects your current position across key areas we assessed. 
              Remember, this is a starting point for your journey forward.
            </p>
          </Card>

          {/* Category Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {Object.entries(results.categoryScores).map(([category, score]) => {
              const categoryLabel = getScoreLabel(score as number);
              return (
                <Card key={category} className="p-4 sm:p-6">
                  <div className="flex items-center mb-3 sm:mb-4">
                    {category === 'readiness' && <Target className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-blue-600" />}
                    {category === 'confidence' && <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-green-600" />}
                    {category === 'clarity' && <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-purple-600" />}
                    <h3 className="font-semibold text-base sm:text-lg capitalize">{category}</h3>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl sm:text-2xl font-bold">{score}</span>
                      <Badge variant="outline" className={`${categoryLabel.color.replace('bg-', 'border-')} border-2 text-xs sm:text-sm`}>
                        {categoryLabel.label}
                      </Badge>
                    </div>
                    <Progress value={score as number} className="h-2 sm:h-3" />
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Key Insights */}
          <Card className="p-6 sm:p-8 mb-6 sm:mb-8 shadow-xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
              <Lightbulb className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 text-yellow-500" />
              Your Personalized Insights
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {results.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 mt-1">
                    {index + 1}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Updated Call to Action with TidyCal Integration */}
          <Card className="p-6 sm:p-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold mb-4">Ready to Explore More?</h3>
            <p className="mb-6 text-sm sm:text-base text-blue-100">
              Your journey doesn't end here. We're here to support your continued growth, 
              but only if you're open to exploring what's possible.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => window.open('https://tidycal.com/newerconsulting', '_blank')}
              >
                Schedule a Clarity Call
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

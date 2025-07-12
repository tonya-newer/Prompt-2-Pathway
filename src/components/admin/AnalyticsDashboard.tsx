
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface AnalyticsDashboardProps {
  leads: any[];
}

export const AnalyticsDashboard = ({ leads }: AnalyticsDashboardProps) => {
  // Score distribution data
  const scoreRanges = [
    { range: '80-100', count: leads.filter(l => l.overallScore >= 80).length, color: '#22c55e' },
    { range: '60-79', count: leads.filter(l => l.overallScore >= 60 && l.overallScore < 80).length, color: '#3b82f6' },
    { range: '40-59', count: leads.filter(l => l.overallScore >= 40 && l.overallScore < 60).length, color: '#eab308' },
    { range: '0-39', count: leads.filter(l => l.overallScore < 40).length, color: '#ef4444' }
  ];

  // Audience split
  const audienceData = [
    { name: 'Business', value: leads.filter(l => l.audience === 'business').length, color: '#3b82f6' },
    { name: 'Individual', value: leads.filter(l => l.audience === 'individual').length, color: '#8b5cf6' }
  ];

  // Source distribution
  const sourceData = leads.reduce((acc: any, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  const sourceChartData = Object.entries(sourceData).map(([source, count]) => ({
    source,
    count
  }));

  // Assessment completion trends (mock data for demo)
  const completionTrends = [
    { date: '2024-01-10', completions: 12, avgScore: 72 },
    { date: '2024-01-11', completions: 15, avgScore: 75 },
    { date: '2024-01-12', completions: 8, avgScore: 68 },
    { date: '2024-01-13', completions: 18, avgScore: 79 },
    { date: '2024-01-14', completions: 22, avgScore: 73 },
    { date: '2024-01-15', completions: 16, avgScore: 77 }
  ];

  // Top performing assessments
  const assessmentPerformance = leads.reduce((acc: any, lead) => {
    if (!acc[lead.assessmentTitle]) {
      acc[lead.assessmentTitle] = {
        title: lead.assessmentTitle,
        count: 0,
        avgScore: 0,
        totalScore: 0
      };
    }
    acc[lead.assessmentTitle].count++;
    acc[lead.assessmentTitle].totalScore += lead.overallScore;
    acc[lead.assessmentTitle].avgScore = Math.round(acc[lead.assessmentTitle].totalScore / acc[lead.assessmentTitle].count);
    return acc;
  }, {});

  const assessmentChartData = Object.values(assessmentPerformance);

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
          <div className="text-3xl font-bold text-green-600">
            {leads.length > 0 ? Math.round((leads.filter(l => l.completionRate === 100).length / leads.length) * 100) : 0}%
          </div>
          <p className="text-sm text-gray-600">Assessment completion rate</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">High Quality Leads</h3>
          <div className="text-3xl font-bold text-blue-600">
            {leads.filter(l => l.overallScore >= 80).length}
          </div>
          <p className="text-sm text-gray-600">Scores 80% or higher</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <div className="text-3xl font-bold text-purple-600">
            {leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.overallScore, 0) / leads.length) : 0}%
          </div>
          <p className="text-sm text-gray-600">Across all assessments</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Top Source</h3>
          <div className="text-xl font-bold text-orange-600">
            {sourceChartData.length > 0 ? sourceChartData.sort((a, b) => b.count - a.count)[0]?.source : 'N/A'}
          </div>
          <p className="text-sm text-gray-600">Primary lead source</p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreRanges}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Audience Split */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Audience Split</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={audienceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {audienceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Source Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Completion Trends */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Completions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completionTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completions" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Assessment Performance Table */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Assessment Performance</h3>
        <div className="space-y-3">
          {assessmentChartData.map((assessment: any, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium">{assessment.title}</h4>
                <p className="text-sm text-gray-600">{assessment.count} completions</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold">{assessment.avgScore}%</div>
                <div className="text-sm text-gray-600">Avg Score</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

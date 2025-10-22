import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { fetchAnalytics } from '@/store/analyticsSlice';
import { RootState } from '@/store';

export const AnalyticsDashboard = () => {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  if (status === 'loading') return <div className="text-center text-lg font-bold text-gray-800">Loading analytics...</div>;
  if (status === 'failed' || !data) return <div className="text-center text-lg font-bold text-gray-800">Error loading analytics</div>;

  const { keyMetrics, scoreRanges, audienceData, sourceChartData, assessmentPerformance, completionTrends } = data;

  return (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
          <div className="text-3xl font-bold text-green-600">
            {keyMetrics.totalLeads > 0 ? Math.round((keyMetrics.completedLeads / keyMetrics.totalLeads) * 100) : 0}%
          </div>
          <p className="text-sm text-gray-600">Assessment completion rate</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">High Quality Leads</h3>
          <div className="text-3xl font-bold text-blue-600">
            {keyMetrics.highQualityLeads}
          </div>
          <p className="text-sm text-gray-600">Scores 80% or higher</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <div className="text-3xl font-bold text-purple-600">
            {keyMetrics.avgScore}
          </div>
          <p className="text-sm text-gray-600">Across all assessments</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Top Source</h3>
          <div className="text-xl font-bold text-orange-600">
            {keyMetrics.topSource || 'N/A'}
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

        {/* Source Distribution */}
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
          {assessmentPerformance.map((assessment: any, index: number) => (
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

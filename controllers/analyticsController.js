const Lead = require('../models/leadModel');

const getAnalytics = async (req, res) => {
  try {
    // Aggregate key metrics and charts
    const aggregation = await Lead.aggregate([
      // Join with Assessment to get title and audience
      {
        $lookup: {
          from: 'assessments',
          localField: 'assessment',
          foreignField: '_id',
          as: 'assessment'
        }
      },
      { $unwind: '$assessment' },

      // Project only needed fields
      {
        $project: {
          score: 1,
          completedAt: 1,
          source: 1,
          assessmentTitle: '$assessment.title',
          audience: '$assessment.audience'
        }
      },

      // Group for various aggregations
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          completedLeads: { $sum: { $cond: [{ $ifNull: ['$completedAt', false] }, 1, 0] } },
          highQualityLeads: { $sum: { $cond: [{ $gte: ['$score', 80] }, 1, 0] } },
          totalScore: { $sum: '$score' },
          scores: { $push: '$score' },
          leads: { $push: '$$ROOT' }
        }
      }
    ]);

    if (!aggregation.length) {
      return res.json({
        keyMetrics: {},
        scoreRanges: [],
        audienceData: [],
        sourceChartData: [],
        assessmentPerformance: [],
        completionTrends: []
      });
    }

    const data = aggregation[0];

    // --- Key Metrics ---
    const avgScore = data.totalLeads > 0 ? Math.round(data.totalScore / data.totalLeads) : 0;

    // --- Score Distribution ---
    const scoreRanges = [
      { range: '80-100', count: data.leads.filter(l => l.score >= 80).length, color: '#22c55e' },
      { range: '60-79', count: data.leads.filter(l => l.score >= 60 && l.score < 80).length, color: '#3b82f6' },
      { range: '40-59', count: data.leads.filter(l => l.score >= 40 && l.score < 60).length, color: '#eab308' },
      { range: '0-39', count: data.leads.filter(l => l.score < 40).length, color: '#ef4444' }
    ];

    // --- Audience Split ---
    const audienceGroups = data.leads.reduce(
      (acc, l) => {
        if (l.audience === 'business') acc.business++;
        else acc.individual++;
        return acc;
      },
      { business: 0, individual: 0 }
    );
    const audienceData = [
      { name: 'Business', value: audienceGroups.business, color: '#3b82f6' },
      { name: 'Individual', value: audienceGroups.individual, color: '#8b5cf6' }
    ];

    // --- Source Distribution ---
    const sourceGroups = data.leads.reduce((acc, l) => {
      acc[l.source] = (acc[l.source] || 0) + 1;
      return acc;
    }, {});
    const sourceChartData = Object.entries(sourceGroups).map(([source, count]) => ({ source, count }));

    // --- Top Source ---
    const topSource =
      Object.entries(sourceGroups).length > 0
        ? Object.entries(sourceGroups).sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A';

    // --- Assessment Performance ---
    const assessmentGroups = data.leads.reduce((acc, l) => {
      if (!acc[l.assessmentTitle]) acc[l.assessmentTitle] = { title: l.assessmentTitle, totalScore: 0, count: 0 };
      acc[l.assessmentTitle].totalScore += l.score || 0;
      acc[l.assessmentTitle].count++;
      acc[l.assessmentTitle].avgScore = Math.round(acc[l.assessmentTitle].totalScore / acc[l.assessmentTitle].count);
      return acc;
    }, {});
    const assessmentPerformance = Object.values(assessmentGroups);

    // --- Completion Trends ---
    const completionTrendsMap = data.leads
      .filter(l => l.completedAt)
      .reduce((acc, l) => {
        const date = l.completedAt.toISOString().split('T')[0];
        if (!acc[date]) acc[date] = { date, completions: 0, totalScore: 0 };
        acc[date].completions++;
        acc[date].totalScore += l.score || 0;
        return acc;
      }, {});
    const completionTrends = Object.values(completionTrendsMap).map(item => ({
      date: item.date,
      completions: item.completions,
      avgScore: Math.round(item.totalScore / item.completions)
    }));

    // Send response
    res.json({
      keyMetrics: {
        totalLeads: data.totalLeads,
        completedLeads: data.completedLeads,
        highQualityLeads: data.highQualityLeads,
        avgScore,
        topSource
      },
      scoreRanges,
      audienceData,
      sourceChartData,
      assessmentPerformance,
      completionTrends
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAnalytics };

const Settings = require('../models/settingsModel');
const Assessment = require('../models/assessmentModel');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({ user_id: req.user.userId });
    if (!settings) {
			// Optionally create a default one if none exists
			settings = await Settings.create({ user_id: req.user.userId });
		}
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getSettingsByAssessmentId = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const settings = await Settings.findOne({ user_id: assessment.user_id });
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
  const settings = await Settings.findOneAndUpdate(
      { user_id: req.user.userId },
      { $set: req.body },
      { new: true, upsert: true }
    );

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
	getSettings,
	updateSettings,
  getSettingsByAssessmentId
}

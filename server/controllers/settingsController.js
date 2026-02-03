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

const getSettingsByAssessmentSlug = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ slug: req.params.slug });
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
    let payload = req.body;

    // If FormData was sent: body has "data" (JSON string) and optionally files in req.files
    if (req.body.data) {
      payload = typeof req.body.data === 'string' ? JSON.parse(req.body.data) : req.body.data;
      if (req.files) {
        const fileFields = [
          'platform.logo',
          'platform.favicon',
          'interactionPage.image1',
          'interactionPage.image2',
          'welcomePage.background',
        ];
        for (const field of fileFields) {
          const files = req.files[field];
          if (files && files[0]) {
            const url = `/uploads/images/${files[0].filename}`;
            const keys = field.split('.');
            let target = payload;
            for (let i = 0; i < keys.length - 1; i++) {
              if (!target[keys[i]]) target[keys[i]] = {};
              target = target[keys[i]];
            }
            target[keys[keys.length - 1]] = url;
          }
        }
      }
    }

    const settings = await Settings.findOneAndUpdate(
      { user_id: req.user.userId },
      { $set: payload },
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
  getSettingsByAssessmentSlug,
};

const Settings = require('../models/settingsModel');

const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    if (req.files) {
      if (req.files.logo) updates.logo = `/uploads/${req.files.logo[0].filename}`;
      if (req.files.favicon) updates.favicon = `/uploads/${req.files.favicon[0].filename}`;
    }

    let settings = await Settings.findOneAndUpdate({}, updates, { new: true, upsert: true });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
	getSettings,
	updateSettings
}

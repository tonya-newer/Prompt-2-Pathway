const VoiceSetting = require("../models/voiceSettingModel");

// Get the global voice setting
const getVoiceSetting = async (req, res) => {
	try {
		let setting = await VoiceSetting.findOne();
		if (!setting) {
			// Optionally create a default one if none exists
			setting = await VoiceSetting.create({});
		}
		res.json(setting);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// Update the global voice setting
const updateVoiceSetting = async (req, res) => {
	try {
		let setting = await VoiceSetting.findOne();
		if (!setting) {
			// Create if it doesn't exist
			setting = await VoiceSetting.create(req.body);
		} else {
			// Update existing
			Object.assign(setting, req.body);
			await setting.save();
		}
		res.json(setting);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

module.exports = {
	getVoiceSetting,
	updateVoiceSetting
}
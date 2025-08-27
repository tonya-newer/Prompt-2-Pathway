const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  platformName: { type: String, default: 'Prompt 2 Pathway' },
  logo: { type: String },
  favicon: { type: String },
  primaryColor: { type: String, default: '#000000' },
  secondaryColor: { type: String, default: '#ffffff' },
  accentColor: { type: String, default: '#007bff' },
  whiteLabel: { type: Boolean, default: false },
});

module.exports = mongoose.model('Settings', settingsSchema);
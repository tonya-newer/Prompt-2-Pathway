const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  platform: {
    name: { type: String, default: 'Prompt 2 Pathway' },
    whiteLabel: { type: Boolean, default: false },
    logo: { type: String },
    favicon: { type: String },
  },
  theme: {
    primaryColor: { type: String, default: '#7c3aed' },
    secondaryColor: { type: String, default: '#2563eb' },
    accentColor: { type: String, default: '#4f46e5' },
  },
  welcomePage: {
    background: { type: String, default: '' },
    heading: { type: String, default: 'Welcome to Your {assessmentTitle} Assessment!' },
    headingColor: { type: String, default: '#1e40af' },
    subHeading: { type: String, default: 'Discover powerful insights about yourself through this personalized assessment experience. Your journey to clarity begins here.' },
    subHeadingColor: { type: String, default: '#4b5563' }
  },
  footer: {
    companyName: { type: String, default: 'Your Company Name' },
    privacyPolicy: { type: String, default: '' },
    termsOfService: { type: String, default: '' },
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model('Settings', settingsSchema);
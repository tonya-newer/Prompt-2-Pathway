const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  ageRange:  { type: String },
  gender:    { type: String, enum: ['male', 'female', 'non-binary', 'prefer-not-to-say', 'other'], default: 'other' },
  assessment:{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  score:     { type: Number },
  source:    { type: String, enum: ['website', 'email', 'referral', 'social-media', 'event', 'other'],  default: 'other' },
  status:    { type: String, enum: ['qualified', 'contacted', 'converted', 'new'], default: 'new' },
  completedAt: { type: Date },
  tags: [{ type: String }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model('Lead', leadSchema);
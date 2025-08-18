const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  email:     { type: String, required: true },
  phone:     { type: String },
  ageRange:  { type: String },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  score:     { type: Number },
  status:    { type: String, enum: ['qualified', 'contacted', 'converted', 'new'], default: 'new' },
  completedAt: { type: Date },
  tags: [{ type: String }]
});

module.exports = mongoose.model('Lead', leadSchema);
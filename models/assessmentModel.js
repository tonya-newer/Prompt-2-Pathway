const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  question: { type: String, required: true },
  voiceScript: { type: String, required: true },
  options: { type: [String], default: [] },
  questionAudio: { type: String }
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  audience: { type: String, enum: ['individual', 'business'], required: true },
  tags: [{ type: String }],
  image: { type: String },
  welcomeMessageAudio: { type: String },
  keepGoingMessageAudio: { type: String },
  congratulationMessageAudio: { type: String },
  questions: [questionSchema]
});

module.exports = mongoose.model('Assessment', assessmentSchema);
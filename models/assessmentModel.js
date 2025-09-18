const mongoose = require('mongoose');
const slugify = require("slugify");

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  question: { type: String, required: true },
  voiceScript: { type: String, required: true },
  options: { type: [String], default: [] },
  audio: { type: String }
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  audience: { type: String, enum: ['individual', 'business'], required: true },
  tags: [{ type: String }],
  image: { type: String },
  welcomeMessageAudio: { type: String },
  keepGoingMessageAudio: { type: String },
  congratulationMessageAudio: { type: String },
  questions: [questionSchema],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

assessmentSchema.pre("validate", async function(next) {
  if (!this.isModified("title")) return next();

  const { nanoid } = await import('nanoid');
  let baseSlug = slugify(this.title, { lower: true, strict: true });
  let slug = baseSlug;

  const Assessment = mongoose.model("Assessment", assessmentSchema);

  // Check for uniqueness
  let exists = await Assessment.findOne({ slug });
  while (exists) {
    slug = `${baseSlug}-${nanoid(6)}`; // append short unique string
    exists = await Assessment.findOne({ slug });
  }

  this.slug = slug;
  next();
})

module.exports = mongoose.model('Assessment', assessmentSchema);
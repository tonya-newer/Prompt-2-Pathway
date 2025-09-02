const mongoose = require("mongoose");

const VoiceSettingSchema = new mongoose.Schema(
  {
    voiceLabel: {
      type: String,
      trim: true,
      default: ''
    },
    provider: {
      type: String,
      enum: ["upload", "elevenLabs", "nativeTTS"],
      default: 'upload'
    },
    languageCode: {
      type: String,
      default: "en-US",
    },
    defaultVolume: {
      type: Number,
      default: 100,
    },
    playbackSpeed: {
      type: Number,
      min: 0.5,
      max: 1.5,
      default: 1.0,
    },
    fallbackToNativeTTS: {
      type: Boolean,
      default: false,
    },
    elevenLabs: {
      voiceId: { type: String, trim: true, default: "" },
      stability: { type: Number, min: 0, max: 1, default: 0.8 },
      similarityBoost: { type: Number, min: 0, max: 1, default: 0.88 },
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }
);

module.exports = mongoose.model("VoiceSetting", VoiceSettingSchema);

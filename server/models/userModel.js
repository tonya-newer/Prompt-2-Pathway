const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: true
    },
    roles: {
      type: [String],
      enum: ["platform_admin", "client_admin"],
      default: ["client_admin"],
    },
    allowedTabs: [
      {
        type: String,
        enum: ["assessments", "leads", "analytics", "voice_settings", "settings"],
        default: ["assessments"]
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Ensure at least one role
userSchema.pre("save", function (next) {
  if (!this.roles || this.roles.length === 0) {
    this.roles = ["client_admin"];
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
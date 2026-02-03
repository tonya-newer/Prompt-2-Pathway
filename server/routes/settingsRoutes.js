const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController.js");
const { authenticate, authorize } = require("../middleware/auth.js");
const imageUpload = require("../middleware/imageUpload.js");

router.get("/", authenticate, authorize(["client_admin"]), settingsController.getSettings);
router.put(
  "/",
  authenticate,
  authorize(["client_admin"]),
  imageUpload.fields([
    { name: "platform.logo", maxCount: 1 },
    { name: "platform.favicon", maxCount: 1 },
    { name: "interactionPage.image1", maxCount: 1 },
    { name: "interactionPage.image2", maxCount: 1 },
    { name: "welcomePage.background", maxCount: 1 },
  ]),
  settingsController.updateSettings
);
router.get("/:slug", settingsController.getSettingsByAssessmentSlug);

module.exports = router;
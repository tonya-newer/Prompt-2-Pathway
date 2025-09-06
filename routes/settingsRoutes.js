const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settingsController.js");
const { authenticate, authorize } = require("../middleware/auth.js");

router.get("/", authenticate, authorize(["client_admin"]), settingsController.getSettings);
router.put("/", authenticate, authorize(["client_admin"]), settingsController.updateSettings);
router.get("/:assessmentId", settingsController.getSettingsByAssessmentId);

module.exports = router;
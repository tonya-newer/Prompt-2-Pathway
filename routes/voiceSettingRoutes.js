const express = require("express");
const router = express.Router();
const voiceSettingController = require("../controllers/voiceSettingController");

router.get("/", voiceSettingController.getVoiceSetting);
router.put("/", voiceSettingController.updateVoiceSetting);

module.exports = router;
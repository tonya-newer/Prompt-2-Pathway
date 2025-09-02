const express = require("express");
const controller = require('../controllers/assessmentController');
const audioUpload = require('../middleware/audioUpload');
const { authenticate, authorize } = require("../middleware/auth.js");

const router = express.Router();

router.get("/", authenticate, authorize(["client_admin"]), controller.getAllAssessments);
router.get("/:id", controller.getAssessmentById);

router.post(
  "/",
  audioUpload.fields([
    { name: 'welcomeMessageAudio', maxCount: 1 },
    { name: 'keepGoingMessageAudio', maxCount: 1 },
    { name: 'congratulationMessageAudio', maxCount: 1 },
    { name: 'questionAudios', maxCount: 50 }
  ]),
  authenticate,
  authorize(["client_admin"]),
  controller.createAssessment
);

router.put(
  "/:id",
  audioUpload.fields([
    { name: 'welcomeMessageAudio', maxCount: 1 },
    { name: 'keepGoingMessageAudio', maxCount: 1 },
    { name: 'congratulationMessageAudio', maxCount: 1 },
    { name: 'questionAudios', maxCount: 50 }
  ]),
  authenticate,
  authorize(["client_admin"]),
  controller.updateAssessment
);

router.delete("/:id", authenticate, authorize(["client_admin"]), controller.deleteAssessment);
router.post("/:id/duplicate", authenticate, authorize(["client_admin"]), controller.duplicateAssessment);

module.exports = router;
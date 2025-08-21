const express = require("express");
const controller = require('../controllers/assessmentController');
const audioUpload = require('../middleware/audioUpload');

const router = express.Router();

router.get("/", controller.getAllAssessments);
router.get("/:id", controller.getAssessmentById);

router.post(
  "/",
  audioUpload.fields([
    { name: 'welcomeMessageAudio', maxCount: 1 },
    { name: 'keepGoingMessageAudio', maxCount: 1 },
    { name: 'congratulationMessageAudio', maxCount: 1 },
    { name: 'questionAudios', maxCount: 50 }
  ]),
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
  controller.updateAssessment
);

router.delete("/:id", controller.deleteAssessment);
router.post("/:id/duplicate", controller.duplicateAssessment);

module.exports = router;
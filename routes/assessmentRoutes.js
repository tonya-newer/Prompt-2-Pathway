const express = require("express");
const upload = require('../middleware/upload');
const controller = require('../controllers/assessmentController');

const router = express.Router();

router.get("/", controller.getAllAssessments);
router.get("/:id", controller.getAssessmentById);
router.post("/", upload.single('image'), controller.createAssessment);
router.put("/:id", upload.single('image'), controller.updateAssessment);
router.delete("/:id", controller.deleteAssessment);
router.post("/:id/duplicate", controller.duplicateAssessment);

module.exports = router;
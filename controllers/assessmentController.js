const Assessment = require('../models/assessmentModel');

const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAssessment = async (req, res) => {
  try {
    const assessmentData = { ...req.body};
    
    if (assessmentData.tags) {
      try {
        assessmentData.tags = JSON.parse(assessmentData.tags);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in tags field' });
      }
    }

    if (assessmentData.questions) {
      try {
        assessmentData.questions = JSON.parse(assessmentData.questions);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in questions field' });
      }
    }

    const newAssessment = new Assessment(assessmentData);
    const savedAssessment = await newAssessment.save();
    res.status(201).json(savedAssessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateAssessment = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.tags) {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in tags field' });
      }
    }

    if (updateData.questions) {
      try {
        updateData.questions = JSON.parse(updateData.questions);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON in questions field' });
      }
    }

    const updatedAssessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    res.json(updatedAssessment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteAssessment = async (req, res) => {
  try {
    const deletedAssessment = await Assessment.findByIdAndDelete(req.params.id);
    if (!deletedAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json({ message: 'Assessment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const duplicateAssessment = async (req, res) => {
  try {
    const original = await Assessment.findById(req.params.id);
    if (!original) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const duplicated = new Assessment({
      ...original.toObject(),
      _id: undefined
    });

    const savedDuplicate = await duplicated.save();
    res.status(201).json(savedDuplicate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllAssessments,
  getAssessmentById,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  duplicateAssessment
};

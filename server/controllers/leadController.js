const Lead = require('../models/leadModel');
const Assessment = require('../models/assessmentModel');

// List all leads
const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ user_id: req.user.userId }).populate('assessment').sort({ completedAt: -1 }); // populate assessment details
    res.json(leads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new lead
const createLead = async (req, res) => {
  try {
    const leadData = req.body;

    if (!leadData.completedAt) {
        leadData.completedAt = new Date();
    }

    const assessment = await Assessment.findById(leadData.assessment);
    leadData.user_id = assessment.user_id;

    const lead = new Lead(leadData);
    const savedLead = await lead.save();

    res.status(201).json(savedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update lead by ID
const updateLead = async (req, res) => {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json(updatedLead);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllLeads,
  createLead,
  updateLead
};
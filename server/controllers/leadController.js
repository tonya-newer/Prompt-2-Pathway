const Lead = require('../models/leadModel');
const Assessment = require('../models/assessmentModel');
const transporter = require('../config/mailer');

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

// Send email to a lead
const sendLeadEmail = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assessment');
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    if (lead.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to email this lead' });
    }

    const { subject, body } = req.body;
    const mailSubject = subject || `Follow-up: ${lead.assessment?.title || 'Your assessment results'}`;
    const mailBody = body || `Hi ${lead.firstName},\n\nThank you for completing the assessment. We'd love to connect and share more insights with you.\n\nBest regards,\nPrompt 2 Pathway`;

    const mailOptions = {
      from: `"Prompt 2 Pathway" <${process.env.SMTP_USER}>`,
      to: lead.email,
      subject: mailSubject,
      text: mailBody,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Email sent successfully', to: lead.email });
  } catch (err) {
    console.error('Send lead email error:', err);
    res.status(500).json({ error: err.message || 'Failed to send email' });
  }
};

module.exports = {
  getAllLeads,
  createLead,
  updateLead,
  sendLeadEmail,
};
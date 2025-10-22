const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { authenticate, authorize } = require("../middleware/auth.js");

// GET all leads
router.get('/', authenticate, authorize(["client_admin"]), leadController.getAllLeads);

// POST create new lead
router.post('/', leadController.createLead);

// PUT update lead by ID
router.put('/:id', authenticate, authorize(["client_admin"]), leadController.updateLead);

router.post('/:id/tags', authenticate, authorize(["client_admin"]),  leadController.addTagToLead);

module.exports = router;
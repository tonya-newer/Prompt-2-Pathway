const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

// GET all leads
router.get('/', leadController.getAllLeads);

// POST create new lead
router.post('/', leadController.createLead);

// PUT update lead by ID
router.put('/:id', leadController.updateLead);

router.post('/:id/tags', leadController.addTagToLead);

module.exports = router;
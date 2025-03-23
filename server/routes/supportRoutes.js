const express = require('express');
const router = express.Router();
const { sendContactForm } = require('../controllers/supportController');

router.post('/contact', sendContactForm);

module.exports = router;
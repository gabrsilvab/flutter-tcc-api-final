const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');
const login = require('../middleware/login.middleware');

router.post(
    '/enviar',
    login.required,
    emailController.enviarEmail,
);

module.exports = router;
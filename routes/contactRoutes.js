// backend/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { sendContactEmail, testEmail } = require('../controllers/contactController');

// ========================================
// MIDDLEWARE DE VALIDATION
// ========================================

const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères')
    .isLength({ max: 100 }).withMessage('Le nom ne peut pas dépasser 100 caractères'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('subject')
    .trim()
    .notEmpty().withMessage('Le sujet est requis')
    .isLength({ min: 3 }).withMessage('Le sujet doit contenir au moins 3 caractères')
    .isLength({ max: 200 }).withMessage('Le sujet ne peut pas dépasser 200 caractères'),
  
  body('message')
    .trim()
    .notEmpty().withMessage('Le message est requis')
    .isLength({ min: 10 }).withMessage('Le message doit contenir au moins 10 caractères')
    .isLength({ max: 5000 }).withMessage('Le message ne peut pas dépasser 5000 caractères')
];

// ========================================
// ROUTES
// ========================================

// Route principale : Envoyer un message de contact
router.post('/send', contactValidation, sendContactEmail);

// Route de test : Vérifier la configuration email
router.get('/test', testEmail);

module.exports = router;
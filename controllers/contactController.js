// backend/controllers/contactController.js

const transporter = require('../config/emailConfig');
const { validationResult } = require('express-validator');

// ========================================
// TEMPLATE EMAIL CLIENT (Confirmation)
// ========================================

const getClientEmailTemplate = (name, subject) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #235347 0%, #163932 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 28px;
    }
    .header p {
      color: #8EB69B;
      margin: 10px 0 0;
      font-size: 16px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #235347;
      font-size: 22px;
      margin-top: 0;
    }
    .content p {
      color: #555;
      line-height: 1.6;
      font-size: 16px;
    }
    .info-box {
      background: #f8fdf9;
      border-left: 4px solid #235347;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      background: #f8fdf9;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    .footer a {
      color: #235347;
      text-decoration: none;
      font-weight: 600;
    }
    .checkmark {
      color: #235347;
      font-size: 48px;
      text-align: center;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✉️ Message reçu !</h1>
      <p>Merci de m'avoir contacté</p>
    </div>
    <div class="content">
      <div class="checkmark">✓</div>
      <h2>Bonjour ${name},</h2>
      <p>J'ai bien reçu votre message concernant : <strong>"${subject}"</strong></p>
      <div class="info-box">
        <p style="margin: 0;">
          <strong>📌 Prochaines étapes :</strong><br>
          Je reviendrai vers vous dans les <strong>24 à 48 heures</strong> pour répondre à votre demande.
        </p>
      </div>
      <p>En attendant, n'hésitez pas à consulter mon portfolio pour découvrir mes projets et compétences.</p>
      <p>À très bientôt,<br><strong>Abdeljalil Sersif</strong></p>
    </div>
    <div class="footer">
      <p>📧 <a href="mailto:abdosarsif28@gmail.com">abdosarsif28@gmail.com</a></p>
      <p>📍 El Jadida, Morocco</p>
      <p style="margin-top: 20px; color: #999; font-size: 12px;">
        Cet email a été envoyé automatiquement. Merci de ne pas y répondre.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};
// SUITE du fichier contactController.js
// (Ajoutez ceci APRÈS la partie 1)

// ========================================
// TEMPLATE EMAIL ADMIN (Notification)
// ========================================

const getAdminEmailTemplate = (name, email, subject, message) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #163932 0%, #0B2B26 100%); padding: 30px 20px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: #8EB69B; margin: 10px 0 0; font-size: 14px; }
    .content { padding: 30px; }
    .message-card { background: #f8fdf9; border-radius: 8px; padding: 20px; margin: 20px 0; border: 1px solid #8EB69B; }
    .info-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
    .info-label { font-weight: 600; color: #235347; }
    .info-value { color: #555; }
    .message-content { background: white; padding: 20px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #235347; }
    .footer { background: #f8fdf9; padding: 20px; text-align: center; color: #666; font-size: 12px; }
    .reply-btn { display: inline-block; background: #235347; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔔 Nouveau message de contact</h1>
      <p>Portfolio - Abdeljalil Sersif</p>
    </div>
    <div class="content">
      <div class="message-card">
        <h2 style="color: #235347; margin-top: 0;">Détails du contact</h2>
        
        <div class="info-row">
          <span class="info-label">👤 Nom :</span>
          <span class="info-value">${name}</span>
        </div>
        
        <div class="info-row">
          <span class="info-label">📧 Email :</span>
          <span class="info-value"><a href="mailto:${email}" style="color: #235347;">${email}</a></span>
        </div>
        
        <div class="info-row" style="border-bottom: none;">
          <span class="info-label">📌 Sujet :</span>
          <span class="info-value">${subject}</span>
        </div>
        
        <div class="message-content">
          <strong style="color: #235347;">💬 Message :</strong>
          <p style="margin: 10px 0 0; color: #333; line-height: 1.6;">${message}</p>
        </div>
        
        <a href="mailto:${email}" class="reply-btn">↩️ Répondre au client</a>
      </div>
    </div>
    <div class="footer">
      <p>Date de réception : ${new Date().toLocaleString('fr-FR', { 
        dateStyle: 'full', 
        timeStyle: 'short' 
      })}</p>
      <p style="margin-top: 10px; color: #999;">Email automatique depuis votre portfolio</p>
    </div>
  </div>
</body>
</html>
  `;
};

// ========================================
// CONTRÔLEUR PRINCIPAL
// ========================================

exports.sendContactEmail = async (req, res) => {
  try {
    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { name, email, subject, message } = req.body;

    // 1. Email de confirmation au client
    const clientMailOptions = {
      from: `"Abdeljalil Sersif" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Message reçu : ${subject}`,
      html: getClientEmailTemplate(name, subject)
    };

    // 2. Email de notification à l'admin
    const adminMailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🔔 Nouveau message de ${name}`,
      html: getAdminEmailTemplate(name, email, subject, message),
      replyTo: email
    };

    // Envoi des deux emails
    await Promise.all([
      transporter.sendMail(clientMailOptions),
      transporter.sendMail(adminMailOptions)
    ]);

    console.log(`✅ Emails envoyés avec succès pour ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: 'Message envoyé avec succès ! Vous recevrez une réponse sous 24-48h.'
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi des emails:', error);
    res.status(500).json({
      success: false,
      message: 'Une erreur est survenue. Veuillez réessayer.'
    });
  }
};

// ========================================
// TEST EMAIL (Optionnel)
// ========================================

exports.testEmail = async (req, res) => {
  try {
    const testMailOptions = {
      from: `"Test Portfolio" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 Test de configuration email',
      html: '<h1>✅ Configuration email réussie !</h1><p>Votre backend est prêt.</p>'
    };

    await transporter.sendMail(testMailOptions);

    res.status(200).json({
      success: true,
      message: 'Email de test envoyé avec succès !'
    });
  } catch (error) {
    console.error('❌ Erreur test email:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi de l\'email de test'
    });
  }
};
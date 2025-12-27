const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('./routes/contactRoutes');

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend portfolio is running!',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur interne est survenue'
  });
});

// Pour Vercel - export l'app sans écouter de port
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // Pour le développement local
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════╗');
    console.log(`║  🚀 Serveur démarré sur le port ${PORT}     ║`);
    console.log(`║  📧 Email: ${process.env.EMAIL_USER}        ║`);
    console.log(`║  🌐 Frontend: ${process.env.FRONTEND_URL}  ║`);
    console.log('╚═══════════════════════════════════════════╝');
    console.log('');
  });
}

module.exports = app;
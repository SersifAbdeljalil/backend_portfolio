const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const contactRoutes = require('../routes/contactRoutes');

dotenv.config();

const app = express();

// ========================================
// CONFIGURATION CORS - CORRIGÉE
// ========================================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://sersif-abdeljalilportfolio.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Origine bloquée par CORS:', origin);
      console.log('✅ Origines autorisées:', allowedOrigins);
      callback(null, true); // Autorise quand même pour le moment
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Gérer explicitement les requêtes preflight
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// LOGS DE DEBUG
// ========================================
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Allowed origins:', allowedOrigins);
  next();
});

// ========================================
// ROUTES
// ========================================
app.use('/api/contact', contactRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend portfolio is running!',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    allowedOrigins: allowedOrigins
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Portfolio Backend API',
    endpoints: {
      health: '/api/health',
      contact: '/api/contact'
    }
  });
});

// ========================================
// GESTION DES ERREURS
// ========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Une erreur interne est survenue'
  });
});

module.exports = app;
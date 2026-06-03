const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedAdminUser } = require('./controllers/authController');
const { seedContactMessages } = require('./controllers/contactController');
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB().then(() => {
  // Seed admin user if db connection was successful
  seedAdminUser();
  seedContactMessages();
});

const app = express();

// Middleware
app.use(cors({
  origin: '*', // For local dev and deployment versatility
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Root path diagnostic route
app.get('/', (req, res) => {
  res.json({ message: 'She Can Foundation Contact API is running...' });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

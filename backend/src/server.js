const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize Express
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Welcome & Health Check Routes
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎓 Student Task Management System API is running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `\x1b[36m🎓 [Server Running]\x1b[0m Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'development'}`
  );
  console.log(
    `\x1b[36m🔗 [API Root]\x1b[0m http://localhost:${PORT}`
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Don't crash immediately in dev to allow debugging
});

module.exports = app;

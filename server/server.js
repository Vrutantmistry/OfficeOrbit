// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from React app
  credentials: true
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks')); // Add task routes

// Basic test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '🎉 Server is working!',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    database: mongoose.connection.name || 'Not connected',
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log('✅ MongoDB Connected!');
    console.log('🏢 Host:', conn.connection.host);
    console.log('🗄️  Database:', conn.connection.name);
    console.log('🔌 Port:', conn.connection.port);
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('🚀 Server running on port', PORT);
  console.log('🌐 API Base: http://localhost:' + PORT + '/api');
  console.log('🧪 Test: http://localhost:' + PORT + '/api/test');
  console.log('👥 Employees: http://localhost:' + PORT + '/api/tasks/admin/employees');
  console.log('📋 Tasks: http://localhost:' + PORT + '/api/tasks/admin/tasks');
});
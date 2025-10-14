// File: backend/server.js

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

// --- This MUST be at the very top to load environment variables ---
dotenv.config();

// Route Imports
import itProgramsRoutes from './routes/itPrograms.js';
import nonItProgramsRoutes from './routes/nonItPrograms.js';
import formRoutes from './routes/formRoutes.js';
import batchRoutes from './routes/batches.js';
import blogRoutes from './routes/blog.js';
import candidateRoutes from './routes/candidates.js';
import requestInfoRoutes from './routes/requestInfo.js';
import jobsRoutes from './routes/jobs.js';
import enrollmentsRoutes from './routes/enrollments.js';
import applicationsRoutes from './routes/applications.js';
import collegeConnectRoutes from './routes/collegeConnect.js';
import registerDemoRoutes from './routes/registerDemo.js';
import loginRoutes from './routes/login.js';
import companyRoutes from './routes/companies.js';
import interviewRoutes from './routes/interview.js';
import managerRoutes from './routes/manager.js';
import recruiterRoutes from './routes/recruiter.js';
import notificationsRoutes from './routes/notifications.js';

const app = express();
const server = http.createServer(app);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? ['https://zeroseven7.netlify.app', 'https://zero-7-ayjp.onrender.com'] : 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.set('io', io);

// --- Middleware Section ---

// CORS Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' ? ['https://zeroseven7.netlify.app'] : ['http://localhost:3000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// --- CORRECTED: JSON and URL-Encoded Middleware with Increased Limit ---
// This replaces the old app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// --- END OF CORRECTION ---

// Static Files Middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Route
app.get('/', (req, res) => {
  res.send('🚀 Zero7 API is running!');
});

// Register all API Routes
app.use('/api/it-programs', itProgramsRoutes);
app.use('/api/non-it-programs', nonItProgramsRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/request-info', requestInfoRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/college-connect', collegeConnectRoutes);
app.use('/api/register-demo', registerDemoRoutes);
app.use('/api/user', loginRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/managers', managerRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/notifications', notificationsRoutes);

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log(`⚡ Client connected: ${socket.id}`);
  socket.on('join', (userData) => {
    if (userData && userData.role) {
      socket.join(userData.role);
      console.log(`User ${userData.name || socket.id} joined the "${userData.role}" room.`);
      if (userData.role === 'admin') {
        socket.join('manager');
        console.log(`Admin ${userData.name || socket.id} also joined the "manager" room.`);
      }
    }
  });
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

// MongoDB Connection and Server Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
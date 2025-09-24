// server.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import { Server } from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url'

// Routes - Now using import
import itProgramsRoutes from './routes/itPrograms.js'
import nonItProgramsRoutes from './routes/nonItPrograms.js'
import formRoutes from './routes/formRoutes.js'
import jobsRoutes from './routes/jobs.js' // <-- Changed
import enrollmentsRoutes from './routes/enrollments.js' // <-- Changed
import applicationsRoutes from './routes/applications.js' // <-- Changed
import batchRoutes from './routes/batches.js'
import authRoutes from './routes/auth.js'
dotenv.config()

const app = express()
const server = http.createServer(app)

// Helper for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      'https://zero7-lw66.onrender.com', // backend host
      'https://zero7tech.netlify.app', // frontend host
      'http://localhost:3000', // local dev
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

// ✅ Make io accessible in routes
app.set('io', io)

// ✅ Middleware
app.use(
  cors({
    origin: [
      'https://zero7-lw66.onrender.com',
      'https://zero7tech.netlify.app',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
)
// Use path.join to create an absolute path for serving static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json()) // <-- important for req.body

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🚀 Zero7 API is running!')
})

// ✅ Routes
app.use('/api/it-programs', itProgramsRoutes)
app.use('/api/non-it-programs', nonItProgramsRoutes)
app.use('/api/forms', formRoutes)
app.use('/api/jobs', jobsRoutes) // <-- Changed
app.use('/api/enrollments', enrollmentsRoutes) // <-- Changed
app.use('/api/applications', applicationsRoutes) // <-- Changed
app.use('/api/batches', batchRoutes)
app.use('/api/auth', authRoutes)
// ✅ MongoDB connection
const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected')

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((err) => console.error('❌ MongoDB error:', err))

// ✅ Socket.io connection logs
io.on('connection', (socket) => {
  console.log('⚡ Client connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id)
  })
})

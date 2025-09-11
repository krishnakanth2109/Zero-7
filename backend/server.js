// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

// Routes
import itProgramsRoutes from "./routes/itPrograms.js";
import nonItProgramsRoutes from "./routes/nonItPrograms.js";
import formRoutes from "./routes/formRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      "https://zero7-lw66.onrender.com", // backend host
      "https://zero7tech.netlify.app",   // frontend host
      "http://localhost:3000",           // local dev
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ✅ Make io accessible in routes
app.set("io", io);

// ✅ Middleware
app.use(
  cors({
    origin: [
      "https://zero7-lw66.onrender.com",
      "https://zero7tech.netlify.app",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json()); // <-- important for req.body

// ✅ Root route
app.get("/", (req, res) => {
  res.send(
    "🚀 Zero7 API is running!"
  );
});

// ✅ Routes
app.use("/api/it-programs", itProgramsRoutes);
app.use("/api/non-it-programs", nonItProgramsRoutes);
app.use("/api/forms", formRoutes);

// ✅ MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

// ✅ Socket.io connection logs
io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

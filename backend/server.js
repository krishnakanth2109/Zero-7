import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import itProgramsRoutes from "./routes/itPrograms.js";
import nonItProgramsRoutes from "./routes/nonItPrograms.js";

dotenv.config();

const app = express();
app.use(cors({
  origin: ["https://zero7-lw66.onrender.com", "https://zero7.netlify.app", "http://localhost:3000"],
  credentials: true
}));

app.use(express.json());

// ✅ Routes
app.use("/api/it-programs", itProgramsRoutes);
app.use("/api/non-it-programs", nonItProgramsRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB error:", err));
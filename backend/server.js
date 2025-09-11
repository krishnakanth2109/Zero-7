import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import itProgramsRoutes from "./routes/itPrograms.js";
import nonItProgramsRoutes from "./routes/nonItPrograms.js";

dotenv.config();

const app = express();

// ✅ CORS setup
app.use(
  cors({
    origin: [
      "https://zero7-lw66.onrender.com", // backend on Render
      "https://zero7tech.netlify.app",   // frontend on Netlify
      "http://localhost:3000"            // local dev
    ],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Root route (for Render homepage)
app.get("/", (req, res) => {
  res.send("🚀 Zero7 API is running! Try /api/it-programs or /api/non-it-programs");
});

// ✅ Routes
app.use("/api/it-programs", itProgramsRoutes);
app.use("/api/non-it-programs", nonItProgramsRoutes);

const PORT = process.env.PORT || 5000;

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB error:", err));

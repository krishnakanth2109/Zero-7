import mongoose from "mongoose";

const NonItProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String },
  price: { type: String, required: true },
  description: { type: String },
  details: { type: String },
  skills: { type: [String] },
  duration: { type: String }
}, { timestamps: true });

export default mongoose.model("NonItProgram", NonItProgramSchema);

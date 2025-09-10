import mongoose from "mongoose";

const ItProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  icon: { type: String, required: true }, // emoji or image url
  price: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: String, required: true },
  technologies: [{ type: String }]
}, { timestamps: true });

export default mongoose.model("ItProgram", ItProgramSchema);

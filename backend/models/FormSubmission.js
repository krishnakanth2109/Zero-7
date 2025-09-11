import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    email: { type: String, required: true },
    purpose: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("FormSubmission", formSubmissionSchema);

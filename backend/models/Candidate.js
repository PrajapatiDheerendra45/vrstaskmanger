import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    position: { type: String, required: true },
    experience: { type: String },
    location: { type: String, required: true },
    comments: { type: String },
    resume: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or your own user model
      // required: true,
    }, // optional if you want tracking
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);

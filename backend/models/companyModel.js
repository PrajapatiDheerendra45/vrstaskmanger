import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    industry: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    hrname: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending", // Awaiting decision
        "collaborated", // Successfully collaborated
        "not_collaborated", // Not collaborated
        "rejected", // Explicitly rejected
        "under_review", // Currently being reviewed
        "approved", // Approved for collaboration
        "declined", // Collaboration request declined
        "on_hold", // Decision put on hold
      ],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // or your own user model
      required: true,
    },
  },
  { timestamps: true }
);

// Add unique indexes to prevent duplicates
companySchema.index({ email: 1 }, { unique: true });
companySchema.index({ companyName: 1 }, { unique: true });

const Company = mongoose.model("Company", companySchema);
export default Company;

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  durationType: { type: String, enum: ['without', 'until'], default: 'without' },
  date:{type:Date},
  dateTime: { type: Date },
  repeat: { type: Boolean, default: false },
  repeatCount: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);

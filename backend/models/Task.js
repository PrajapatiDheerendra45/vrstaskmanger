import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
 staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
  },
  title: { type: String, required: true },
  description: String,
  deadline: { type: Date, required: true },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);

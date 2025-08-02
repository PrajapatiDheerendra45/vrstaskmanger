import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  interviewDate: String,
  interviewTime: String,
  interviewType: String,
  hr: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: String,
  status: {
    type: String,
   enum: ['Scheduled', 'In Progress', 'Pending', 'Completed', 'Selected', 'Cancelled', 'Rescheduled'],
    default: 'Scheduled'
  },
  notes: String
}, { timestamps: true });

export default mongoose.model('Interview', interviewSchema);

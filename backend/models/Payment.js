import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["Candidate", "Company"],
      required: true,
    },

    name: String,
    email: String,
    mobile: String,
    service: String,
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ["UPI", "Bank Transfer", "Cash", "Card"],
    },
    transactionId: String,
    remarks: String,
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;

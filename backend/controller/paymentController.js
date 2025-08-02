import Payment from "../models/Payment.js";

// ✅ Create Payment
export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({status:true,message:"Payment created Successfully..!",data:payment});
  } catch (err) {
    res.status(500).json({ message: "Error creating payment", error: err.message });
  }
};

// ✅ Get All Payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payments", error: err.message });
  }
};

// ✅ Get Single Payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ message: "Error fetching payment", error: err.message });
  }
};

// ✅ Update Payment
export const updatePayment = async (req, res) => {
  try {
    const updated = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating payment", error: err.message });
  }
};

// ✅ Delete Payment
export const deletePayment = async (req, res) => {
  try {
    const deleted = await Payment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting payment", error: err.message });
  }
};

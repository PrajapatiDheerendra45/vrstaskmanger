import express from "express";
import { createPayment, deletePayment, getAllPayments, getPaymentById, updatePayment } from "../controller/paymentController.js";


const router = express.Router();

router.post("/create", createPayment);
router.get("/get", getAllPayments);
router.get("/get/:id", getPaymentById);
router.put("/update/:id", updatePayment);
router.delete("/delete/:id", deletePayment);

export default router;

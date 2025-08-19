import express from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  updateExpenseStatus,
  getExpenseAnalytics,
  getExpenseCategories
} from "../controller/expenseController.js";
import { requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get expense categories (no auth required)
router.get("/categories", getExpenseCategories);

// All other routes require authentication
// router.use(requireSignIn);

// Create new expense
router.post("/create", createExpense);

// Get all expenses with filtering and pagination
router.get("/get", getAllExpenses);

// Get expense by ID
router.get("/get/:id", getExpenseById);

// Update expense
router.put("/update/:id", updateExpense);

// Delete expense
router.delete("/delete/:id", deleteExpense);

// Approve/Reject expense
router.put("/status/:id", updateExpenseStatus);

// Get expense analytics
router.get("/analytics", getExpenseAnalytics);

export default router;

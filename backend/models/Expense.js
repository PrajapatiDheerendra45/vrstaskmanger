import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Office Rent",
        "Employee Salaries & Wages",
        "Travel Expenses",
        "Office Utilities",
        "Stationery / Office Supplies",
        "Marketing & Advertising",
        "Equipment Purchase",
        "Maintenance & Repairs",
        "Training & Development",
        "Insurance Premiums",
        "Taxes & Compliance Fees",
        "Other"
      ],
      required: true,
    },
    otherCategory: {
      type: String,
      required: function() {
        return this.category === "Other";
      }
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Bank Transfer", "Card", "UPI", "Cheque"],
      required: true
    },
    receiptNumber: {
      type: String,
      trim: true
    },
    vendor: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending"
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    approvedAt: {
      type: Date
    },
    remarks: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
expenseSchema.index({ category: 1, date: -1 });
expenseSchema.index({ status: 1 });
expenseSchema.index({ createdBy: 1 });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;

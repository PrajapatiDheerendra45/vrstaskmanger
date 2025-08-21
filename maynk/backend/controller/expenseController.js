import Expense from "../models/Expense.js";
import User from "../models/userModel.js";

// Create new expense
export const createExpense = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing"
      });
    }

    const {
      category,
      otherCategory,
      amount,
      description,
      date,
      paymentMethod,
      receiptNumber,
      vendor,
      remarks
    } = req.body;

    // Validate required fields
    if (!category || !amount || !description || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Category, amount, description, and payment method are required"
      });
    }

    // Validate other category if category is "Other"
    if (category === "Other" && !otherCategory) {
      return res.status(400).json({
        success: false,
        message: "Other category is required when category is 'Other'"
      });
    }

    const expense = new Expense({
      category,
      otherCategory: category === "Other" ? otherCategory : undefined,
      amount,
      description,
      date: date || new Date(),
      paymentMethod,
      receiptNumber,
      vendor,
      remarks,
      createdBy: req.user?._id || "64f8b5c8e4b0b8b8b8b8b8b8" // Temporary fix - use a default user ID
    });

    await expense.save();

    res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense
    });
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({
      success: false,
      message: "Error creating expense",
      error: error.message
    });
  }
};

// Get all expenses with filtering and pagination
export const getAllExpenses = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      search
    } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter by status
    if (status && status !== "All") {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Filter by amount range
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    // Search in description, vendor, or receipt number
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: "i" } },
        { vendor: { $regex: search, $options: "i" } },
        { receiptNumber: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const expenses = await Expense.find(query)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Expense.countDocuments(query);

    res.status(200).json({
      success: true,
      data: expenses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expenses",
      error: error.message
    });
  }
};

// Get expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("approvedBy", "name email");

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expense",
      error: error.message
    });
  }
};

// Update expense
export const updateExpense = async (req, res) => {
  try {
    const {
      category,
      otherCategory,
      amount,
      description,
      date,
      paymentMethod,
      receiptNumber,
      vendor,
      remarks
    } = req.body;

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    // Only allow updates if expense is pending
    if (expense.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot update approved or rejected expense"
      });
    }

    const updateData = {
      category,
      otherCategory: category === "Other" ? otherCategory : undefined,
      amount,
      description,
      date,
      paymentMethod,
      receiptNumber,
      vendor,
      remarks
    };

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      success: false,
      message: "Error updating expense",
      error: error.message
    });
  }
};

// Delete expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    // Only allow deletion if expense is pending
    if (expense.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete approved or rejected expense"
      });
    }

    await Expense.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting expense",
      error: error.message
    });
  }
};

// Approve/Reject expense
export const updateExpenseStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'"
      });
    }

    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    const updateData = {
      status,
      remarks,
      approvedBy: req.user._id,
      approvedAt: new Date()
    };

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email")
     .populate("approvedBy", "name email");

    res.status(200).json({
      success: true,
      message: `Expense ${status.toLowerCase()} successfully`,
      data: updatedExpense
    });
  } catch (error) {
    console.error("Error updating expense status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating expense status",
      error: error.message
    });
  }
};

// Get expense analytics
export const getExpenseAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.$gte = new Date(startDate);
      if (endDate) dateFilter.date.$lte = new Date(endDate);
    }

    // Total expenses
    const totalExpenses = await Expense.countDocuments(dateFilter);

    // Total amount
    const totalAmount = await Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // Amount by category
    const amountByCategory = await Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$category", total: { $sum: "$amount" }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // Amount by status
    const amountByStatus = await Expense.aggregate([
      { $match: dateFilter },
      { $group: { _id: "$status", total: { $sum: "$amount" }, count: { $sum: 1 } } }
    ]);

    // Monthly expenses for the last 12 months
    const monthlyExpenses = await Expense.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 }
    ]);

    // Recent expenses
    const recentExpenses = await Expense.find(dateFilter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        totalExpenses,
        totalAmount: totalAmount[0]?.total || 0,
        amountByCategory,
        amountByStatus,
        monthlyExpenses,
        recentExpenses
      }
    });
  } catch (error) {
    console.error("Error fetching expense analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching expense analytics",
      error: error.message
    });
  }
};

// Get expense categories
export const getExpenseCategories = async (req, res) => {
  try {
    console.log("Categories endpoint called");
    const categories = [
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
    ];

    console.log("Sending categories:", categories);
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching categories",
      error: error.message
    });
  }
};

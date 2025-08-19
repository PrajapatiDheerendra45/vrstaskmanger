import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import mongoose from "mongoose";

export const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    roleId,
    role,
    phone,
    designation,
    department,
    joiningDate,
    status,
  } = req.body;



  // 💥 Check required fields
  let missingFields = [];
  ["name", "email", "password"].forEach((field) => {
    if (!req.body[field]) missingFields.push(field);
  });
  if (missingFields.length)
    return res.status(400).json({
      message: `${missingFields.join(", ")} ${
        missingFields.length > 1 ? "are" : "is"
      } required`,
    });

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash password manually in controller
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const user = new User({
      name,
      email,
      password: hashedPassword,
      roleId: roleId || undefined,
      role: role || undefined,
      phone: phone || "",
      designation: designation || "",
      department: department || "",
      joiningDate: joiningDate || "",
      status: status || "active",
    });

    // Save user
    const savedUser = await user.save();

    // Success response
    return res.status(201).json({
      status: true,
      message: "User Registerd Successfully...!",
      user: user,
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  let missingFields = [];
  ["email", "password"].forEach((field) => {
    if (!req.body[field]) missingFields.push(field);
  });
  if (missingFields.length)
    return res.status(400).json({
      message: `${missingFields.join(", ")} ${
        missingFields.length > 1 ? "are" : "is"
      } required`,
    });

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Success response
    return res.status(200).json({
      status: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleId: user.roleId,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAllUsers = async (req, res) => {
  try {
    // Get all users from DB
    const users = await User.find().select("-password"); // Exclude password

    if (!users || users.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No users found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.error("Get users error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
export const getAllUsersById = async (req, res) => {
  try {
    const { _id } = req.params;
    const user = await User.findById(_id).select("-password");
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
// Get User Dashboard Statistics
export const getUserDashboardStats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Import models
    const Company = (await import('../models/companyModel.js')).default;
    const Candidate = (await import('../models/Candidate.js')).default;
    const Interview = (await import('../models/Interview.js')).default;
    const Task = (await import('../models/Task.js')).default;

    // Get counts for the specific user
    const totalCompanies = await Company.countDocuments({ createdBy: userId });
    const totalCandidates = await Candidate.countDocuments({ createdBy: userId });
    const totalInterviews = await Interview.countDocuments({ hr: userId });
    const totalTasks = await Task.countDocuments({ staffId: userId });

    // Get task status distribution
    const taskStatusStats = await Task.aggregate([
      { $match: { staffId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get interview status distribution
    const interviewStatusStats = await Interview.aggregate([
      { $match: { hr: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get monthly data for the last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Promise.all([
      // Companies by month
      Company.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId), createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // Candidates by month
      Candidate.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId), createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // Interviews by month
      Interview.aggregate([
        { $match: { hr: new mongoose.Types.ObjectId(userId), createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      // Tasks by month
      Task.aggregate([
        { $match: { staffId: new mongoose.Types.ObjectId(userId), createdAt: { $gte: sixMonthsAgo } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Get recent data for charts
    const recentInterviews = await Interview.find({ hr: userId })
      .sort({ createdAt: -1 })
      .limit(7)
      .populate('candidateId', 'fullName');

    const recentTasks = await Task.find({ staffId: userId })
      .sort({ createdAt: -1 })
      .limit(7);

    // Format task status data for charts
    const taskStatusData = taskStatusStats.map(stat => ({
      name: stat._id,
      value: stat.count,
      color: stat._id === 'Completed' ? '#10B981' : 
             stat._id === 'In Progress' ? '#F59E0B' : '#EF4444'
    }));

    // Format interview status data for charts
    const interviewStatusData = interviewStatusStats.map(stat => ({
      name: stat._id,
      value: stat.count,
      color: stat._id === 'Scheduled' ? '#3B82F6' :
             stat._id === 'Completed' ? '#10B981' :
             stat._id === 'Pending' ? '#F59E0B' : '#EF4444'
    }));

    // Format monthly data for charts
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      
      const companiesCount = monthlyStats[0].find(item => item._id === monthKey)?.count || 0;
      const candidatesCount = monthlyStats[1].find(item => item._id === monthKey)?.count || 0;
      const interviewsCount = monthlyStats[2].find(item => item._id === monthKey)?.count || 0;
      const tasksCount = monthlyStats[3].find(item => item._id === monthKey)?.count || 0;
      
      monthlyData.push({
        month: monthNames[date.getMonth()],
        companies: companiesCount,
        candidates: candidatesCount,
        interviews: interviewsCount,
        tasks: tasksCount
      });
    }

    return res.status(200).json({
      status: true,
      message: "Dashboard statistics fetched successfully",
      stats: {
        totalCompanies,
        totalCandidates,
        totalInterviews,
        totalTasks,
        recentInterviews,
        recentTasks,
        taskStatusData,
        interviewStatusData,
        monthlyData
      }
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error.message);
    return res.status(500).json({
      status: false,
      message: "Server error",
    });
  }
};
export const updateUser = async (req, res) => {
  try {
    const userId = req.params._id;
    const {
      name,
      email,
      password,
      phone,
      designation,
      department,
      joiningDate,
      status,
    } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Update fields only if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (designation) user.designation = designation;
    if (department) user.department = department;
    if (joiningDate) user.joiningDate = joiningDate;
    if (status) user.status = status;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      status: true,
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        designation: updatedUser.designation,
        department: updatedUser.department,
        joiningDate: updatedUser.joiningDate,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    console.error("Update user error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Delete user
    await user.deleteOne();

    return res.status(200).json({
      status: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "your-email@gmail.com",
        pass: process.env.EMAIL_PASS || "your-app-password",
      },
    });

    // Email content
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || "your-email@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested a password reset for your account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p>This link will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br>Your Application Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    return res.status(500).json({ message: "Error sending reset email" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ message: "Error resetting password" });
  }
};

export const googleLogin = async (req, res) => {
  const { email, name, googleId, picture } = req.body;

  if (!email || !name || !googleId) {
    return res.status(400).json({ message: "Email, name, and googleId are required" });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user with Google info
      const newUser = new User({
        name,
        email,
        googleId,
        profilePicture: picture,
        password: crypto.randomBytes(32).toString("hex"), // Random password for Google users
        role: 0, // Default to user role
        status: "active",
      });
      user = await newUser.save();
    } else {
      // Update existing user with Google info
      user.googleId = googleId;
      if (picture) user.profilePicture = picture;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      status: true,
      message: "Google login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        roleId: user.roleId,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};



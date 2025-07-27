import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      // required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      // required: [true, 'Please add a password'],
    },
    phone: {
      type: String,
          default: "",
      // required: [true, 'Please add a password'],
    },
    designation: {
      type: String,
          default: "",
      // required: [true, 'Please add a password'],
    },
    department: {
      type: String,
          default: "",
      // required: [true, 'Please add a password'],
    },
    joiningDate: {
      type: String,
          default: "",
      // required: [true, 'Please add a password'],
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role", // Reference collection name (agar chaho)
      required: false, // By default false, but for clarity we mention it
    },
    role: {
      type: Number,
      default: 1,
      required: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    // Password reset fields
    resetPasswordToken: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
    // Google OAuth fields
    googleId: {
      type: String,
      default: undefined,
    },
    profilePicture: {
      type: String,
      default: undefined,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

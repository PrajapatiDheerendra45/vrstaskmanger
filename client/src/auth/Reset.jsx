import React, { useState } from "react";
import { FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/imslogo.png";
import Header from "../Component/Header";
import Footer from "../Component/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Component/Loader";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false); // Loader ke liye state
  const handleResetPassword = async () => {
    if (!email || !otp || !newPassword) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://hola9.in/auth/resetpassword/",
        {
          email,
          otp,
          newPassword: newPassword,
        }
      );

      if (response.data?.message) {
        toast.success(response.data.message);
        setNavigating(true);

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Server error! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex h-screen bg-gradient-to-r from-purple-700 to-red-500">
        {/* Left Section with Background Image */}
        <div className="w-1/2 relative hidden lg:block">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/forgot-password-mobile-illustration-download-in-svg-png-gif-file-formats--security-access-lock-user-interface-pack-design-development-illustrations-6430775.png?f=webp"
            alt="Background"
            className="w-full h-full object-cover shadow opacity-80 hover:blur-sm blur-none transition duration-500"
          />
        </div>

        {/* Right Section with Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-2 py-16">
          <div className="w-full max-w-md p-2 md:p-8 gap-5 bg-white rounded-lg shadow-lg">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Logo" className="w-58 h-24" />
            </div>
            {navigating ? (
              <Loader className=" relative" />
            ) : (
              <div>
                <h2 className="text-2xl mt-5 mb-5 font-semibold text-center">
                  Reset Password
                </h2>

                {/* Email Input */}
                <div className="relative mb-5">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* OTP Input */}
                <div className="relative mb-5">
                  <FaKey className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* New Password Input */}
                <div className="relative mb-5">
                  <FaLock className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            )}

            {/* Reset Button */}
            <button
              onClick={handleResetPassword}
              className={`w-full text-white p-3 rounded-md text-lg flex items-center justify-center transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={loading}
            >
              {loading ? <Loader /> : "Reset Password"}
            </button>

            <p className="text-center text-gray-600 mt-4">
              Remembered your password?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default ResetPassword;

import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios"; // For API request
import logo from "../assets/images/imslogo.png";
import forgate from "../assets/images/forgate.png";
import Footer from "../Component/Footer";
import Header from "../Component/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Component/Loader";
const Forgotpassword = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [loading, setLoading] = useState(false); // State for button loading
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Navigation function
  const [navigating, setNavigating] = useState(false);
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://hola9.in/auth/forgetpassword/",
        {
          email: email,
        }
      );
    
      if (response.data) {
        setNavigating(true);
        toast.success(response.data.message)
        setTimeout(() => {
          navigate("/reset");
        }, 3000);
        
        // Redirect if API is successful
      } else {
        toast.error(response.data.message || "Something went wrong!");
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
            src={forgate}
            alt="Background"
            className="w-full h-full object-cover shadow opacity-80 hover:blur-sm blur-none transition duration-500"
          />
        </div>

        {/* Right Section with Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-2 py-16">
          <div className="w-full max-w-md p-2 md:p-8 bg-white rounded-lg shadow-lg">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img src={logo} alt="Logo" className="w-58 h-24" />
            </div>

            {/* Title */}

            {navigating ? (
              <Loader className=" relative"/>
            ) : (
            <div>
              <h2 className="text-2xl mt-5 mb-5 font-semibold text-center">
                Forgot Password
              </h2>

              {/* Email Input */}
              <div className="relative mb-4">
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

              {/* Error Message */}
              {/* {error && <p className="text-red-500 text-center mb-2">{error}</p>} */}

              {/* Submit Button */}
              <button
                onClick={handleForgotPassword}
                className={`w-full text-white p-3 rounded-md text-lg transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Forgot Password"}
              </button>
            </div>
            )}

            {/* Redirect to Login */}
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

export default Forgotpassword;

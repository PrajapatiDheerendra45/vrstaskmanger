import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserPlus } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { HiOutlineRefresh } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import admission_banner from "../assets/admission_banner.png";
import logo from "../assets/logo.png";
import reg from "../assets/reg.jpg";

import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";


const Registration = () => {

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const roleParam = params.get("role") || "1"; // Default role to 1 if not present

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    captcha: "", 
    terms_and_conditions: false,
  });

  const [errors, setErrors] = useState();
  const [captchaCode, setCaptchaCode] = useState("");
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.terms_and_conditions) {
      toast.error("Please accept the terms and conditions.");
      return;
    }
    if (formData.captcha !== captchaCode) {
      toast.error("Captcha does not match.");
      return;
    }

    const requestData = new FormData();
    Object.keys(formData).forEach((key) => {
      requestData.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "https://hola9.in/auth/register/",
        requestData
      );
      if (response.data.status) {
        console.log("response", response);
        toast.success("Registration successful! ");
        setNavigating(true);
        
        setTimeout(() => {
          navigate("/login?role=1");
        }, 3000);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        toast.error("Error: " + JSON.stringify(error.response.data));
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  return (
    <>
     
      <div className="w-full min-h-screen flex flex-col items-center bg-gray-50">
        <div className="flex flex-wrap justify-around items-center gap-2 w-full py-10 ">
          <div className="flex flex-col md:flex-row items-center gap-4 p-10">
            <img
              src={admission_banner}
              alt="Admissions Open Now"
              className="w-full max-w-4xl h-auto rounded-lg shadow-2xl shadow-red-500 transition-transform duration-500 hover:scale-105 opacity-95"
            />
            <div className="flex items-center justify-center animate-bounce bg-red-500 text-white rounded-full text-center text-xl font-bold p-1">
              
              <img className="w-90 h-70 rounded-full" src={reg} alt="" srcset="" />
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-300 p-6 shadow-2xl shadow-blue-500 rounded-md w-96">
            {navigating ? (
              <Loader className=" relative" />
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center pb-5">
                  <img src={logo} alt="LMS Logo" className="h-28 w-36" />
                </div>

                {/* Name Field */}
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
                />

                {/* Email Field */}
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
                />
                {/* Password Field */}
                <div className="relative mb-3">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* Confirm Password */}
                <div className="relative mb-3">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm Password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                {/* Captcha Display */}
                <div className="flex justify-between items-center w-full p-3 rounded-md bg-blue-100 border border-blue-400 text-blue-600 italic font-semibold">
                  {captchaCode}
                  <HiOutlineRefresh
                    onClick={generateCaptcha}
                    className="cursor-pointer hover:text-blue-700"
                  />
                </div>

                {/* Captcha Input */}
                <input
                  type="text"
                  name="captcha"
                  placeholder="Enter Captcha"
                  value={formData.captcha}
                  onChange={handleChange}
                  className="w-full p-3 mt-3 border border-gray-300 rounded-md mb-3 focus:ring-2 focus:ring-blue-500"
                />

                {/* Terms and Conditions Checkbox */}
                <div className="flex items-start space-x-2 text-sm text-gray-700 mt-3">
                  <input
                    type="checkbox"
                    name="terms_and_conditions"
                    className="mt-1 cursor-pointer"
                    checked={formData.terms_and_conditions}
                    onChange={handleChange}
                  />
                  <p>Accept Terms & Conditions</p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white mt-5 py-2 rounded-md cursor-pointer hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  Register
                </button>
              </form>
            )}

            {/* Already have an account? */}
            <p className="mt-3 text-center text-lg font-medium">
              Already have an account?{" "}
              <span className="bg-gradient-to-r from-red-500 to-teal-500 text-white px-3 py-1 rounded-lg shadow-md cursor-pointer hover:scale-105 transition">
                <Link to="/">Login</Link>
              </span>
            </p>
          </div>
        </div>
        <ToastContainer />
      </div>
      
    </>
  );
};

export default Registration;

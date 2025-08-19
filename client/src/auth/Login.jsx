import React, { useRef, useState, useEffect } from "react";
import { User } from "lucide-react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import logo from "../assets/logo.png";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/Auth";
import { Link } from "react-router-dom";

const Login = () => {
  const email = useRef();
  const password = useRef();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role") || "0"; // Default to User role

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    const auth = storedAuth ? JSON.parse(storedAuth) : null;

    if (auth?.user?.role === 1) {
      navigate("/admin");
    } else if (auth?.user?.role === 0 && auth?.AccessToken) {
      navigate("/user");
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/users/login/", {
        email: email.current.value,
        password: password.current.value,
        role: Number(role),
      });

      console.log("response", response);
      if (response.status === 200) {
        const token = response.data.token;
        const user = response.data.user;

        const newAuth = {
          user,
          AccessToken: token,
          RefreshToken: "",
        };

        setAuth(newAuth);
        console.log("✅ Auth set successfully:", newAuth);

        localStorage.setItem(
          "auth",
          JSON.stringify({
            user,
            access: token,
            refresh: "",
          })
        );

        toast.success(response.data.message);

        setTimeout(() => {
          navigate(user.role === 1 ? "/admin" : "/user");
        }, 1000);
      } else {
        toast.error(
          "Login failed: " + (response.data.message || "Invalid credentials")
        );
      }
    } catch (error) {
      toast.error(
        "Login failed: " +
          (error.response?.data.message || "Invalid credentials")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Initialize Google OAuth
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id",
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.prompt();
      } else {
        toast.error("Google OAuth not available");
      }
    } catch (error) {
      toast.error("Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleCallback = async (response) => {
    try {
      const { credential } = response;
      const decoded = JSON.parse(atob(credential.split('.')[1]));
      
      const googleData = {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
        picture: decoded.picture,
      };

      const apiResponse = await axios.post("/api/v1/users/google-login/", googleData);
      
      if (apiResponse.status === 200) {
        const token = apiResponse.data.token;
        const user = apiResponse.data.user;

        const newAuth = {
          user,
          AccessToken: token,
          RefreshToken: "",
        };

        setAuth(newAuth);
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user,
            access: token,
            refresh: "",
          })
        );

        toast.success("Google login successful!");
        setTimeout(() => {
          navigate(user.role === 1 ? "/admin" : "/user");
        }, 1000);
      }
    } catch (error) {
      toast.error("Google login failed: " + (error.response?.data.message || "Authentication error"));
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4">
        {/* Left Section - Image */}
        <div className="hidden md:flex md:w-1/2 justify-center">
          <a href="/">
            <img
              src="https://i.pinimg.com/736x/49/b9/64/49b96466ab917ca807451e05456233f2.jpg"
              alt="LMS Logo"
              className="w-121 h-138 object-cover rounded-md shadow-2xl shadow-red-500"
            />
          </a>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="p-6 bg-white shadow-2xl shadow-blue-500 rounded-lg w-full max-w-md space-y-5">
            <div className="text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 p-3 rounded-lg shadow-lg mb-6">
              {role === "1" ? (
                <div>
                  <h2 className="text-2xl font-bold">🔐 Admin Login Panel</h2>
                  <p className="mt-2 text-lg">
                    Access your **Admin Dashboard**, manage users, and monitor
                    system activities.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold">🔓 User Login Portal</h2>
                  <p className="mt-2 text-lg">
                    Log in to **your account**, explore features, and stay
                    connected.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-center mb-4">
              <a href="/">
                <img src={logo} alt="LMS Logo" className="h-20 w-24" />
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <User className="h-5 w-5 text-gray-600" />
                <input
                  placeholder="Enter your email"
                  type="email"
                  className="w-full outline-none text-gray-700"
                  ref={email}
                  required
                />
              </div>

              <div className="flex items-center space-x-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <input
                  placeholder="********"
                  type={showPassword ? "text" : "password"}
                  className="w-full outline-none text-gray-700"
                  ref={password}
                  required
                />
                <span
                  className="cursor-pointer text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="text-left">
                <Link
                  to="/forget"
                  className="inline-flex items-center gap-2 text-red-500 text-sm font-medium hover:underline hover:text-red-600 transition"
                >
                  <span className="text-lg">🔑</span>
                  Forgotten your password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition"
            >
              <FaGoogle className="text-red-500" />
              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <p className="mt-4 text-center text-sm">
              <span className="text-gray-600">Don't have an account?</span>
              <Link
                to="/register"
                className="text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>

            <a href="/">
              <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Go To Home
              </button>
            </a>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Login;

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
  console.log("Before clear:", localStorage);

  localStorage.clear();  // Attempt to clear everything

  console.log("After clear:", localStorage); // Check if anything remains

  setTimeout(() => {
    navigate("/");
  }, 3000);
}, [navigate]);


  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-800 via-indigo-600 to-blue-500 text-white text-center">
    <div className="p-10 bg-white shadow-2xl rounded-3xl text-gray-900 max-w-lg transform scale-105 transition duration-300">
      <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-500">
        You've Logged Out from LMS!
      </h1>
      <p className="text-lg font-medium">
        Your journey of learning continues. You have been successfully logged out of the Learning Management System.
      </p>
      <p className="text-sm mt-3 text-gray-600">
        Redirecting you to the login page for more knowledge...
      </p>
      <div className="mt-6 animate-spin h-8 w-8 border-t-4 border-indigo-500 border-solid rounded-full mx-auto"></div>
    </div>
  </div>
  
  );
};

export default Logout;

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Unauthorized = () => {
  const navigate = useNavigate();
  localStorage.clear();
  return (
    <div className="flex items-center justify-center h-screen bg-red-600 text-white text-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white text-red-600 p-8 rounded-2xl shadow-lg flex flex-col items-center"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold"
        >
          🚫 Access Denied! 🚫
        </motion.h1>
        <p className="text-lg mt-2 font-semibold">You do not have permission to access this page.</p>
        <p className="text-md mt-1 text-gray-600">Please  Login...! if you believe this is a mistake.</p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 text-lg font-semibold shadow-md hover:bg-blue-700 transition-all"
          onClick={() => navigate("/")}
        >
          <FaHome className="text-xl" /> Go to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Unauthorized;

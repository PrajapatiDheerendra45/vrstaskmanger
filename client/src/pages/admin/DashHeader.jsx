import React from "react";
import { UserCircle } from "lucide-react";
import { motion } from "framer-motion";

const DashHeader = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }} // Start from -100px (out of view)
      animate={{ y: 0, opacity: 1 }} // Slide down to original position
      transition={{ duration: 1, ease: "easeOut" }} // Smooth transition
      className="flex fixed top-0  left-0 right-0 mb-16 items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-purple-600 shadow-lg"
    >
      {/* Scrolling LMS Text */}
      <div className="overflow-hidden whitespace-nowrap text-white text-xl font-bold tracking-wide w-1/2">
        <motion.div
          className="inline-block"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        >
          🚀 Welcome to Learning Management System | Empower Your Learning 📚
        </motion.div>
      </div>

      {/* Profile Icon */}
      <div className="flex items-center space-x-4">
        <UserCircle className="w-10 h-10 text-white cursor-pointer hover:text-yellow-400 transition-transform transform hover:scale-110" />
      </div>
    </motion.header>
  );
};

export default DashHeader;

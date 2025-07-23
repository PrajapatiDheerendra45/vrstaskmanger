import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimeout = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Start session timer from current time
    const timeoutDuration = 120 * 60 * 1000; // 120 minutes in ms // ⏱️ For testing, 20 seconds (Use 120*60*1000 for 120 min)
    
    const sessionTimer = setTimeout(() => {
      sessionStorage.clear(); // Clear session or local storage
      setShowPopup(true); // Show popup

      // Redirect after few seconds (optional)
      setTimeout(() => {
        navigate("/");
        setShowPopup(false);
      }, 3000); // wait 3 sec before redirect
    }, timeoutDuration);

    // Cleanup
    return () => clearTimeout(sessionTimer);
  }, []);

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
        <div className="bg-white px-10 py-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-fade-in-up border border-red-300">
          <h2 className="text-2xl font-bold text-red-600 mb-4">⚠️ Session Expired</h2>
          <p className="text-gray-700 text-lg mb-6">
            Your session has ended due to inactivity or timeout.
            <br />
            Please login again to continue.
          </p>
          <button
            className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition duration-300 text-lg shadow-md"
            onClick={() => window.location.href = "/"}
          >
            Go to Login
          </button>
        </div>
      </div>
      
      )}
    </>
  );
};

export default SessionTimeout;

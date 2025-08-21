import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import logo from "../../assets/logo.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  const handleLogout = () => {
    setShowPopup(true);
    setIsOpen(false);
  localStorage.clear();
  navigate("/")

    // You can also clear localStorage or token here if needed
  };

  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Home" },
    { path: "/admin/", icon: "fas fa-list", label: "Dashboard" },
    { path: "/admin/add-user", icon: "fas fa-user", label: "Add Staff" },
    { path: "/admin/staffs", icon: "fas fa-users", label: "Manage Staff" },
    { path: "/admin/allottask", icon: "fas fa-users", label: "Allot Task" },
    { path: "/admin/managetask", icon: "fas fa-users", label: "Mange Task" },
    { path: "/admin/interview", icon: "fas fa-users", label: "Interview" },
    { path: "/admin/get-candidate-data", icon: "fas fa-users", label: "candidate-data" },
    { path: "/admin/companiesData", icon: "fas fa-cart-plus", label: "companies Data" },
    { path: "/admin/collaborat", icon: "fas fa-cart-plus", label: "Collaborat Company" },
    { path: "/admin/schedules", icon: "fas fa-calendar-alt", label: "Calendar" },
    { path: "/admin/manage-event", icon: "fa-solid fa-calendar-week", label: "Manage Event" },
    { path: "/admin/payment-submision", icon: "fa-solid fa-calendar-week", label: "SubmitPayment " },
    { path: "/admin/payment", icon: "fa-solid fa-calendar-week", label: "Payment Submision" },
    { path: "/admin/add-expense", icon: "fas fa-plus-circle", label: "Add Expense" },
    { path: "/admin/manage-expenses", icon: "fas fa-chart-line", label: "Manage Expenses" },
    { path: "/admin/profile", icon: "fas fa-user", label: "Profile" },
 
  ];

  return (
    <>
      <div className="flex h-screen">
        {/* Mobile Toggle Button */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-md font-serif"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={20} />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed lg:relative top-0 left-0 h-full w-64 bg-white overflow-y-auto shadow-md flex flex-col justify-between transition-transform duration-300 z-50 font-serif ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          {/* Close Button for Mobile */}
          <button
            className="lg:hidden absolute top-4 right-4 text-gray-600"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes size={20} />
          </button>

          {/* Sidebar Content */}
          <div>
            <a href="/">
              <div className="flex justify-center p-5">
                <img src={logo} className="h-34 w-36" alt="Logo" />
              </div>
            </a>

            <h1 className="text-1xl gap-2 font-bold text-purple-900 flex items-center px-4 mb-2">
              <MdDashboard className="mr-2" />
              Admin Dashboard
            </h1>

            <nav className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-400 font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  <i className={`${item.icon} text-gray-600`}></i>
                  <span className="ml-3 hover:text-blue-500">{item.label}</span>
                </Link>
              ))}

              {/* Logout as separate button */}
              <button
                onClick={handleLogout}
                className="flex items-center w-full p-2 mt-2 text-gray-600 hover:bg-red-400 font-bold"
              >
                <i className="fas fa-sign-out-alt text-gray-600"></i>
                <span className="ml-3 hover:text-white">Logout</span>
              </button>
            </nav>
          </div>

          {/* Upgrade Button */}
          <div className="px-2 pb-5">
            <button className="w-full bg-violet-800 py-4 rounded-2xl text-white font-extrabold">
              Upgrade to PRO & Enhance Your Learning...!
            </button>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          ></div>
        )}
      </div>

      {/* Logout Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-40">
          <div className="bg-red-500 p-16 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold text-white">🎉 Thank You! 🎉</h2>
            <p className="text-white text-lg mt-2">
              You have successfully logged out. See you again soon! 🚀
            </p>
            <button
              onClick={handleClosePopup}
              className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-red-600 transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

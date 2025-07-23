import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import logo from "../../assets/logo.png";

const UserSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setShowPopup(true);
    setUser(null);

    setTimeout(() => {
      setShowPopup(false);
      navigate("/");
    }, 5000);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate("/");
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar Toggle Button for Mobile */}
        <button
          className="lg:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={20} />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed lg:relative top-0 left-0 h-full w-64 bg-white overflow-y-auto shadow-md flex flex-col justify-between transition-transform duration-300 z-50 ${
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
            <div className="flex justify-center p-5">
              <img src={logo} className="h-34 w-36" alt="Logo" />
            </div>

            <h1 className="text-1xl gap-2 font-bold text-purple-900 flex items-center">
              <MdDashboard className="ml-2" />
              User Dashboard
            </h1>

            <nav className="h-full px-3 py-4 overflow-y-auto bg-gray-50">
              {[
                 { path: "/", icon: "fas fa-home", label: "Home" },
                 { path: "/user/", icon: "fas fa-list", label: "Dashboard" },
                 {
                   path: "/user/allotedtask",
                   icon: "fas fa-box-open",
                   label: "Alloted Task",
                 },
                 {
                   path: "/user/calender",
                   icon: "fas fa-calendar-alt",
                   label: "Calendar",
                 },
                 {
                   path: "/user/submittask",
                   icon: "fas fa-upload",
                   label: "Submit Task",
                 },
                 {
                   path: "/user/candidate-data",
                   icon: "fas fa-folder-open",
                   label: "Candidate Data",
                 },
                   {
                   path: "/user/get-candidate-data",
                   icon: "fas fa-folder-open",
                   label: "Get Candidate Data",
                 },
                   {
                   path: "/user/interview",
                   icon: "fas fa-folder-open",
                   label: "Interview",
                 },
                   {
                   path: "/user/companylisting",
                   icon: "fas fa-folder-open",
                   label: "Company Registration",
                 },

                   {
                   path: "/user/getcompanylisting",
                   icon: "fas fa-folder-open",
                   label: "Company listing",
                 },


 
 
                 {
                   path: "/user/profile",
                   icon: "fas fa-user",
                   label: "Profile",
                 },
                 {
                   path: "/user/logout",
                   icon: "fas fa-sign-out-alt",
                   label: "Logout",
                 },
              ].map((item, index) => (
                <Link
                  key={index}
                  className="flex items-center p-2 text-gray-600 hover:bg-gray-400 font-bold"
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Close sidebar on link click
                >
                  <i className={`${item.icon} text-gray-600`}></i>
                  <span className="ml-3 hover:text-blue-500">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Upgrade to Pro Button */}
          <div className="px-2 pb-5">
            <button className="w-full bg-violet-800 py-4 rounded-2xl text-white font-extrabold">
              Upgrade to PRO & Enhance Your Learning...!
            </button>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
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

export default UserSidebar;

import React from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";


// import Test from "./Test";
import { useAuth } from "../context/Auth";


import UserDashoard from "../pages/users/UserDashoard";
import UserSidebar from "../pages/users/UserSidebar";

import Logout from "../auth/Logout";
import UserCalender from "../pages/users/UserCalender";

import UserProfile from "../pages/admin/UserProfile";
import InterviewScheduler from "../pages/users/InterviewScheduler";
import CompanyRegistrationForm from "../pages/users/CompanyRegistrationForm";
import CandidateRegistrationForm from "../pages/users/CandidateRegistrationForm";
import CandidateTable from "../pages/users/CandidateTable";
import GetTaskTable from "../pages/users/GetTaskTable";
import DailyTaskForm from "../pages/users/DailyTaskForm";
import CompanyTable from "../pages/users/CompanyTable";



const StaffRoute = () => {
  const [auth] = useAuth();

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
     <div className="flex h-screen">
      {/* Sidebar should always be visible */}
      <UserSidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<UserDashoard />} />
        <Route path="/interview" element={<InterviewScheduler />} />
        <Route path="/companylisting" element={<CompanyRegistrationForm />} />
        <Route path="/getcompanylisting" element={<CompanyTable />} />
        <Route path="/candidate-data" element={<CandidateRegistrationForm  />} />
        <Route path="/get-candidate-data" element={<CandidateTable  />} />
        <Route path="/allotedtask" element={<GetTaskTable  />} />
        <Route path="/calender" element={< UserCalender />} />
        <Route path="/submittask" element={< DailyTaskForm />} />
       
        <Route path="/profile" element={<UserProfile />} /> 
        <Route path="/logout" element={<Logout />} />
      </Routes>
      </div>
    </div>
    </>
  );
};

export default StaffRoute;

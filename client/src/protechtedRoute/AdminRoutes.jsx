import React, { useEffect } from "react";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Sidebar from "../pages/admin/Sidebar.jsx";

import { useAuth } from "../context/Auth";
import MainContentDash from "../pages/admin/MainContentDash.jsx";

import CalendarComponent from "../pages/admin/CalendarComponent.jsx";
import NewEvent from "../pages/admin/NewEvent.jsx";
import ManageEvent from "../pages/admin/ManageEvent.jsx";
import Users from "../pages/admin/Users.jsx";
import UserProfile from "../pages/admin/UserProfile.jsx";
import Logout from "../auth/Logout.jsx";

import AddStaff from "../pages/admin/AddStaff.jsx";
import StaffTable from "../pages/admin/StaffTable.jsx";
import EditStaff from "../pages/admin/EditStaff.jsx";
import CompanyTable from "../pages/admin/CompaniesData.jsx";
import AssignTask from "../pages/admin/AllotTask.jsx";
import GetTaskTable from "../pages/admin/ManageTask.jsx";
import AllInterviewsTable from "../pages/admin/AllInterview.jsx";
import CandidateTable from "../pages/admin/CandidateTable.jsx";
import PaymentForm from "../pages/admin/PaymentForm.jsx";
import PaymentTable from "../pages/admin/PaymentTable.jsx";
import Collaborat from "../pages/admin/Collaborat.jsx";

const AdminRoutes = () => {
  const [auth] = useAuth();

  return (
    
    <>
    <div className="flex h-screen">
      {/* Sidebar should always be visible */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
      <Routes>
        <Route path="/" element={<MainContentDash />} />
        {/* <Route path="/products" element={<Courses />} />  */}
        <Route path="/add-user" element={<AddStaff />} /> 
        <Route path="/staffs" element={<StaffTable />} />
        <Route path="/edit-staff/:id" element={<EditStaff />} /> 
        <Route path="/companiesData" element={<CompanyTable />} /> 
        <Route path="/allottask" element={<AssignTask />} /> 
        <Route path="/managetask" element={<GetTaskTable />} /> 
        <Route path="/interview" element={<AllInterviewsTable />} /> 
        <Route path="/get-candidate-data" element={<CandidateTable />} /> 
        <Route path="/payment-submision" element={<PaymentForm />} /> 
        <Route path="/payment" element={<PaymentTable />} /> 

        {/* <Route path="/manage-products" element={<ManageCourses />} />  */}
        {/* <Route path="/add-product" element={<AddCourseForm />} />  */}
        <Route path="/schedules" element={<CalendarComponent />} />
        <Route path="/add-event" element={<NewEvent />} />
        <Route path="/collaborat" element={<Collaborat />} />
        <Route path="/manage-event" element={<ManageEvent />} />
        {/* <Route path="/upload-media" element={<UploadData />} /> */}
        {/* <Route path="/manage-media" element={<ManageMedia />} /> */}
        <Route path="/user" element={<Users/>} />
        <Route path="/schedules" element={<CalendarComponent />} /> 
        <Route path="/profile" element={<UserProfile />} /> 
        <Route path="/logout" element={<Logout />} /> 
        {/* <Route path="/dash" element={<Home />} /> */}

        {/* <Route path="/*" element={<Test />} /> */}
        {/* rahul routing */}
        {/* {/* <Route path="log-out" element={<Logout />} /> */}
    
      </Routes> 
     

        

        
     
      </div>
    </div>
    
    </>
  );
};

export default AdminRoutes;

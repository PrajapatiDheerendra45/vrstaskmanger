import React from "react";
import { Routes, Route } from "react-router-dom";

import Unauthorized from "../authentication/Unauthorized";
import AdminProtectedRoute from "../protechtedRoute/AdminProtectedRoute";
import AdminRoutes from "../protechtedRoute/AdminRoutes";
import StaffRoute from "../protechtedRoute/StaffRoute";
import StaffProtectedRoute from "../protechtedRoute/StaffProtectedRoute";
import Register from "../auth/Register.jsx";
import Login from "../auth/Login.jsx";



const AppRoutes = () => {
 
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />

        {/* <Route path="/registration" element={<Registration />} /> */}
        {/* <Route path="/login" element={<Login />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/forget" element={<Forgotpassword />} /> */}
        {/* <Route path="admin" element={<AdminRoute />} /> */}
        {/* <Route path="/calendar" element={<CalendarComponent />} /> */}
        <Route path="/access-denied" element={<Unauthorized />} />
        {/* <Route path="/calendar" element={<Calendar />} /> */}
        {/* <Route path="/loader" element={<Loader />} /> */}
        <Route path="*" element={<div>Page Not Found</div>} />

        {/* admin  and staff routes  */}
        <Route path="/admin/*" element={<AdminProtectedRoute />}>
          <Route path="*" element={<AdminRoutes />} /> 
        </Route>
        <Route path="/user/*" element={<StaffProtectedRoute />}>
          <Route path="*" element={<StaffRoute />} />
        </Route>
        
        {/*  */}
      </Routes>
    </>
  );
};

export default AppRoutes;

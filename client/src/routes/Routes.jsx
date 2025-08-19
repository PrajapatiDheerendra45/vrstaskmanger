import React from "react";
import { Routes, Route } from "react-router-dom";

import Unauthorized from "../authentication/Unauthorized";
import AdminProtectedRoute from "../protechtedRoute/AdminProtectedRoute";
import AdminRoutes from "../protechtedRoute/AdminRoutes";
import StaffRoute from "../protechtedRoute/StaffRoute";
import StaffProtectedRoute from "../protechtedRoute/StaffProtectedRoute";
import Register from "../auth/Register.jsx";
import Login from "../auth/Login.jsx";
import Forgotpassword from "../auth/Forgotpassword.jsx";
import ResetPassword from "../auth/Reset.jsx";

const AppRoutes = () => {
 
  return (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<Forgotpassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/access-denied" element={<Unauthorized />} />
        <Route path="*" element={<div>Page Not Found</div>} />

        {/* admin  and staff routes  */}
        <Route path="/admin/*" element={<AdminProtectedRoute />}>
          <Route path="*" element={<AdminRoutes />} /> 
        </Route>
        <Route path="/user/*" element={<StaffProtectedRoute />}>
          <Route path="*" element={<StaffRoute />} />
        </Route>
      </Routes>
    </>
  );
};

export default AppRoutes;

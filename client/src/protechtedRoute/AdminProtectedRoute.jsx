import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Loader from "../component/Loader.jsx";

export const AdminProtectedRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("auth");
    const parsedData = storedData ? JSON.parse(storedData) : null;

    

    const isAdmin = parsedData?.access && parsedData?.user?.role === 1;
    setOk(isAdmin);

    const timer = setTimeout(() => {
      setLoading(false);
      if (!isAdmin) {
        navigate("/access-denied");
      }
    }, 500); // Shorter delay

    return () => clearTimeout(timer);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  return ok ? <Outlet /> : null;
};

export default AdminProtectedRoute;

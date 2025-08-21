import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Loader from "../components/Loader";

export const StaffProtectedRoute = () => {
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem("auth");
    const parsedData = storedData ? JSON.parse(storedData) : null;

    console.log("🔐 LocalStorage auth:", parsedData);

    const isUser = parsedData?.access && parsedData?.user?.role === 0;
    setOk(isUser);

    const loaderTimeout = setTimeout(() => {
      setLoading(false);
      if (!isUser) {
        navigate("/access-denied");
      }
    }, 1000); // Optional delay for loader

    return () => clearTimeout(loaderTimeout);
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

export default StaffProtectedRoute;

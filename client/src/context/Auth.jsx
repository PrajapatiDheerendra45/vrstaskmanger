import React, { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    AccessToken: "",
    RefreshToken: "",
  });

  useEffect(() => {
    const storedData = sessionStorage.getItem("auth");
   
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setAuth({
          user: parsedData?.user || null,
          AccessToken: parsedData?.access || "",
          RefreshToken: parsedData?.refresh || "",
        });
      } catch (error) {
        console.error("Error parsing auth data:", error);
      }
    }
  }, []);
  

  // Update axios headers when auth state changes
  useEffect(() => {
    if (auth?.AccessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.AccessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth.AccessToken]);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return useContext(AuthContext) || [{ user: null, AccessToken: "", RefreshToken: "" }, () => {}];
};

export { useAuth, AuthProvider };

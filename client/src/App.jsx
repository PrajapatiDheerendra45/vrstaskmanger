
import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import SessionTimeout from "./authentication/SessionTimeout";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <SessionTimeout />
        <AppRoutes />
      </BrowserRouter>

     
    </>
  );
};

export default App;
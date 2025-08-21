import React from "react";

// import MainContentDash from "./MainContentDash";
import Sidebar from "./Sidebar";
 import Addcourse from "./Addcourse";

function AdminDashBoard() {
  return (
    <>
      <div>
        <div className="flex h-screen">
          {/* sidebar content start */}
          <Sidebar />

          {/* main content start */}
          {/* <MainContentDash /> */}
          <Addcourse />

          {/* main content end */}
        </div>
      </div>
    </>
  );
}

export default AdminDashBoard;

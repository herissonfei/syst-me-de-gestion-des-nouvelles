import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
import { Button } from "antd";

export default function Test() {
  // const loca = useLocation();
  // console.log("@", loca);
  return (
    <div>
      {/* {localStorage.getItem("token") ? (
        <Navigate to="/" />
      ) : (
        <Navigate to="/login" />
      )} */}

      {/* {loca.pathname === "/" ? <Navigate replace to="/home" /> : null} */}

      <Button type="primary">Button</Button>
    </div>
  );
}

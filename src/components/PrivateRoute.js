// src/routes/PrivateRoute.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../config";

const PrivateRoute = () => {
  const token = getToken();

  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";
import { Navigate } from "react-router-dom";
import Login from "../User/Login";
import AuthCheckingComponent from "./AuthCheckingComponent";

function AuthRoute({ children }) {
  //! use query
  const { isError, isLoading, error, data, isSuccess, refetch } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });
  if (isLoading) return <AuthCheckingComponent />;
  if (!data) {
    return <Navigate to="/login" />;
  }
  return children;
}

export default AuthRoute;

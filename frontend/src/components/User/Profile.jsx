import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { checkAuthStatusAPI } from "../../APIServices/users/usersAPI";
import { useDispatch } from "react-redux";
import { isAuthenticated } from "../../redux/slices/authSlices";
function Profile() {
  //! use query
  const { isError, isLoading, error, data, isSuccess, refetch } = useQuery({
    queryKey: ["user-auth"],
    queryFn: checkAuthStatusAPI,
  });

  //*dispatch
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(isAuthenticated(data));
  }, [data]);
  return <div>Profile</div>;
}

export default Profile;

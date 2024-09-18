import CreatePost from "./components/Posts/CreatePost";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import UpdatePost from "./components/Posts/UpdatePost";
import PostList from "./components/Posts/PostList";
import Home from "./components/Home/Home";
import PostDetails from "./components/Posts/PostDetails";
import Login from "./components/User/Login";
import Register from "./components/User/Register";
import Profile from "./components/User/Profile";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthStatusAPI } from "./APIServices/users/usersAPI";
import { useQuery } from "@tanstack/react-query";
import { isAuthenticated } from "./redux/slices/authSlices";
import { useEffect } from "react";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import UserDashboard from "./components/User/UserDashboard";
import AccountSummaryDashboard from "./components/User/AcountSummary";
AccountSummaryDashboard

function App() {
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
  //* get login info from store
  const { userAuth } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      {userAuth ? <PrivateNavbar /> : <PublicNavbar />}
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<UserDashboard />} path="/dashboard">
          <Route
            element={
              <AuthRoute>
                <CreatePost />
              </AuthRoute>
            }
            path="create-post"
          />
          <Route
            element={
              <AuthRoute>
                <AccountSummaryDashboard />
              </AuthRoute>
            }
            path=""
          />
        </Route>
        <Route element={<PostList />} path="/posts" />
        <Route element={<PostDetails />} path="/posts/:postId" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route
          element={
            <AuthRoute>
              <Profile />
            </AuthRoute>
          }
          path="/profile"
        />
        {/* <Route element={<UpdatePost />} path="/posts/:postId" /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

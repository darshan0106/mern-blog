import axios from "axios";
//create that must return a promise
const BASE_URL = "https://mern-blog-fxp7.onrender.com/api/v1/notifications";

//!fetch all notifications
export const fetchNotificationsAPI = async (postData) => {
  const response = await axios.get(`${BASE_URL}`);
  return response.data;
};

//! Read notification
export const readNotificationAPI = async (notificationId) => {
  const posts = await axios.put(`${BASE_URL}/${notificationId}`, {});
  return posts.data;
};

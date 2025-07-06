import axios from "axios";
//create that must return a promise
const BASE_URL = "https://mern-blog-fxp7.onrender.com/api/v1/earnings";

//! Fetch all catgories
export const fetchAllEarningsAPI = async () => {
  const posts = await axios.get(BASE_URL);
  return posts.data;
};

//! Fetch all user earnings
export const getMyEarningsAPI = async () => {
  const posts = await axios.get(`${BASE_URL}/my-earnings`, {
    withCredentials: true,
  });
  return posts.data;
};

import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/categories";

//! Create category api
export const addCategoryAPI = async (postData) => {
  const response = await axios.post(`${BASE_URL}/create`, postData, {
    withCredentials: true,
  });
  return response.data;
};

//! Fetch all categories
export const fetchCategoriesAPI = async () => {
  const posts = await axios.get(BASE_URL);
  return posts.data;
};

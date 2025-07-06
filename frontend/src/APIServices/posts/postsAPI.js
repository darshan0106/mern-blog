import axios from "axios";

const BASE_URL = "https://mern-blog-fxp7.onrender.com/api/v1/posts";

//! Create post api
export const createPostAPI = async (postData) => {
  const response = await axios.post(`${BASE_URL}/create`, postData, {
    withCredentials: true,
  });
  return response.data;
};

//! Update post api
export const updatePostAPI = async (postData) => {
  const response = await axios.put(
    `${BASE_URL}/${postData?.postId}`,
    {
      title: postData.title,
      description: postData.description,
    },
    { withCredentials: true }
  );
  return response.data;
};

//! Fetch all posts
export const fetchAllPosts = async (filters) => {
  const posts = await axios.get(BASE_URL, {
    params: filters,
  });
  return posts.data;
};

//! Fetch  post
export const fetchPost = async (postId) => {
  const posts = await axios.get(`${BASE_URL}/${postId}`, {
    withCredentials: true,
  });
  return posts.data;
};

//! Delete  post
export const deletePostAPI = async (postId) => {
  const posts = await axios.delete(`${BASE_URL}/${postId}`, {
    withCredentials: true,
  });
  return posts.data;
};

//!like post api
export const likePostAPI = async (postId) => {
  const response = await axios.put(
    `${BASE_URL}/likes/${postId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};
//!dislike post api
export const dislikePostAPI = async (postId) => {
  const response = await axios.put(
    `${BASE_URL}/dislikes/${postId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

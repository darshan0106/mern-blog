import React from "react";
import { useParams } from "react-router-dom";
import { fetchPost, updatePostAPI } from "../../APIServices/posts/postsAPI";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";

function UpdatePost() {
  //! get postId
  const { postId } = useParams();
  //! use query
  const { data } = useQuery({
    queryKey: ["post-details"],
    queryFn: () => fetchPost(postId),
  });

  const postMutation = useMutation({
    mutationKey: ["update-post"],
    mutationFn: updatePostAPI,
  });
  const formik = useFormik({
    // initial values
    initialValues: {
      title: data?.postFound?.title || "",
      description: data?.postFound?.description || "",
    },
    enableReinitialize: true,
    // validation
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    }),
    // submit
    onSubmit: (values) => {
      const postData = {
        title: values.title,
        description: values.description,
        postId: postId,
      };
      postMutation.mutate(postData);
    },
  });
  //* get loading state
  const isLoading = postMutation.isPending;
  const isError = postMutation.isError;
  const isSuccess = postMutation.isSuccess;
  const error = postMutation.error;

  return (
    <div>
      <h1>You are editing - {data?.postFound.title}</h1>
      <div>
        {isLoading && <p>Loading...</p>}
        {isSuccess && <p>Post updated successfully</p>}
        {isError && <p>{error.message}</p>}
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Enter title"
            {...formik.getFieldProps("title")}
          />
          <input
            type="text"
            name="description"
            placeholder="Enter description"
            {...formik.getFieldProps("description")}
          />
          <button type="submit">Update</button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePost;

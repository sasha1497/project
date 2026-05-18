import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const editFormApi = createApi({
  reducerPath: "editFormApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    editForm: builder.mutation<any, any>({
      query: ({ id, ...formData }) => ({
        url: `user/update/${id}`, // assuming you're passing user id
        method: "PATCH",
        body: formData,
      }),
    }),
  }),
});

export const { useEditFormMutation } = editFormApi;

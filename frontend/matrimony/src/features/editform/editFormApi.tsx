import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const editFormApi = createApi({
  reducerPath: "editFormApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    editForm: builder.mutation<any, any>({
      query: ({ id, ...formData }) => ({
        url: `user/update/${id}`, // assuming you're passing user id
        method: "post",           // use PUT for updates
        body: formData,
      }),
    }),
  }),
});

export const { useEditFormMutation } = editFormApi;

// src/features/deleteaccount/deleteAccountApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const deleteAccountApi = createApi({
  reducerPath: "deleteAccountApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL // fallback
  }),
  endpoints: (builder) => ({
    deleteUserAccount: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/user/delete/${userId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
    }),
  }),
});

export const { useDeleteUserAccountMutation } = deleteAccountApi;

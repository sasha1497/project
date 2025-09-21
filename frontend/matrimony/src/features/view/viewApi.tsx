import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const viewApi = createApi({
  reducerPath: 'viewApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, void>({
       query: (body) => ({
        url: 'user/list',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetAllUsersQuery } = viewApi;

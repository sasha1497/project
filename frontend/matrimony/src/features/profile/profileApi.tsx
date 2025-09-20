// src/features/profile/profileApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, number>({
      query: (id) => `user/get/${id}`,
    }),
  }),
  
});

export const { useGetUserProfileQuery } = profileApi;

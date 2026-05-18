// src/features/profile/profileApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

type UserProfileQueryArg =
  | number
  | {
      id: number;
      viewerUserId?: number | string | null;
    };

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
    getUserProfile: builder.query<any, UserProfileQueryArg>({
      query: (arg) => {
        if (typeof arg === 'number') {
          return `user/get/${arg}`;
        }

        return {
          url: `user/get/${arg.id}`,
          params: arg.viewerUserId ? { viewerUserId: arg.viewerUserId } : undefined,
        };
      },
    }),
  }),
  
});

export const { useGetUserProfileQuery } = profileApi;

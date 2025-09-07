// src/features/form/imageApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3002',
  }),
  endpoints: (builder) => ({
    uploadImages: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: '/upload/user/dp/1', // Adjust endpoint if needed
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadImagesMutation } = imageApi;

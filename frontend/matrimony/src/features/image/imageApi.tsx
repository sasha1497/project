// src/features/form/imageApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    // uploadImages: builder.mutation<any, any>({
    //   query: ({ formData, userId }) => ({
    //     url: `/upload/user/dp/${userId}`,
    //     method: 'POST',
    //     body: formData,
    //   }),
    // }),
    uploadImages: builder.mutation<any, { formData: FormData; userId: string }>({
  query: ({ formData, userId }) => ({
    url: `/upload/user/dp/${userId}`,
    method: 'POST',
    body: formData,
  }),
}),
  }),
});

export const { useUploadImagesMutation } = imageApi;

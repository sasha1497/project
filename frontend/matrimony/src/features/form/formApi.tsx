// src/features/form/formApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URL,
  }),
  endpoints: (builder) => ({
    submitForm: builder.mutation<any, any>({
      query: (formData) => ({
        url: 'user/save',
        method: 'post',
        body: formData,
      }),
    }),
  }),
});

export const { useSubmitFormMutation } = formApi;

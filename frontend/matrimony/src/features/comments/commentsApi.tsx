import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
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
  tagTypes: ['ProfileComments'],
  endpoints: (builder) => ({
    getProfileComments: builder.query<any, number>({
      query: (profileUserId) => `user/${profileUserId}/comments`,
      providesTags: (_result, _error, profileUserId) => [
        { type: 'ProfileComments', id: profileUserId },
      ],
    }),
    addProfileComment: builder.mutation<
      any,
      {
        profileUserId: number;
        commenter_name: string;
        commenter_user_id?: number;
        content: string;
        parent_comment_id?: number | null;
      }
    >({
      query: ({ profileUserId, ...body }) => ({
        url: `user/${profileUserId}/comments`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { profileUserId }) => [
        { type: 'ProfileComments', id: profileUserId },
      ],
    }),
  }),
});

export const { useGetProfileCommentsQuery, useAddProfileCommentMutation } = commentsApi;

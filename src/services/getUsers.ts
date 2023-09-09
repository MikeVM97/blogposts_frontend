import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const URL = process.env.NODE_ENV === "production"
  ? "https://blogposts.up.railway.app"
  : "http://localhost:3000";

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: URL }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
  }),
})

export const { useGetUsersQuery } = usersApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { URL } from "constants/index"

export const usersApi = createApi({
	reducerPath: "usersApi",
	baseQuery: fetchBaseQuery({ baseUrl: URL }),
	endpoints: (builder) => ({
		getUsers: builder.query<User[], void>({
			query: () => "/users"
		})
	})
})

export const { useGetUsersQuery } = usersApi

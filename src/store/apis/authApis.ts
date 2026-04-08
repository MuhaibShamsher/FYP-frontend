import { baseApi } from './baseApi'

export interface LoginResponse {
  email: string;
  role: string;
  refresh_token: string;
  access_token: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (data) => ({
        url: 'auth/register/',
        method: 'POST',
        body: data,
      }),
    }),

    login: builder.mutation<LoginResponse, any>({
      query: (data) => ({
        url: 'auth/login/',
        method: 'POST',
        body: data,
      }),
    }),

    logout: builder.mutation<void, { refresh_token: string }>({
      query: (data) => ({
        url: 'auth/logout/',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<void, any>({
      query: (data) => ({
        url: 'auth/password/change/',
        method: 'POST',
        body: data,
      }),
    }),

    resetPasswordEmail: builder.mutation<void, string>({
      query: (email) => ({
        url: 'auth/password/reset/email/',
        method: 'POST',
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<
      void,
      { user_id: string; reset_token: string; password: string }
    >({
      query: ({ user_id, reset_token, password }) => ({
        url: `auth/password/reset/${user_id}/${reset_token}/`,
        method: 'POST',
        body: { password },
      }),
    }),

    getUsers: builder.query<User[], void>({
      query: () => 'auth/users/',
      providesTags: ['Users'],
    }),
  }),
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useResetPasswordEmailMutation,
  useResetPasswordMutation,
  useGetUsersQuery,
} = authApi


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

export interface AuthResponse {
  user: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://student-traning-4k2u.vercel.app/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),

  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (data) => ({
        url: "user/login",
        method: "POST",
        body: data,
      }),
    }),

    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (data) => ({
        // Apne backend ka actual signup route verify karna.
        url: "user/signup",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
} = authApi;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  _id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  role?: string;
  phone?: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const getStoredUser = (): AuthUser | null => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: getStoredUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string;
        user: AuthUser;
      }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;

      localStorage.setItem("token", action.payload.token);
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload.user)
      );
    },

    logout: (state) => {
      state.token = null;
      state.user = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
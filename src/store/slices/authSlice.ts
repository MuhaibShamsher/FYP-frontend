import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {

    loginSuccess: (
      state,
      action: PayloadAction<{
        email: string;
        role: string;
        refresh_token: string;
        access_token: string;
      }>
    ) => {
      const { email, role, refresh_token, access_token } = action.payload;
      state.user = { email, role };
      state.token = access_token;
      state.refreshToken = refresh_token;
    },


    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },

    updateToken: (
      state,
      action: PayloadAction<{ token: string; refreshToken?: string }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },

  },
});

export const { loginSuccess, logout, updateToken } = authSlice.actions;

export default authSlice.reducer;

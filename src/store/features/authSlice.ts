import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  user: string;
  token: string;
}

const initialState: AuthState = {
  user: "",
  token: "",
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    logout: (state) => {
      state.user = ""
      state.token = "";
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
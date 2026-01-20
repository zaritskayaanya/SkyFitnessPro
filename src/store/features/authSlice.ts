import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface User {
//   email: string;
//   password: string;
//   _id: number;
// }

interface AuthState {
  user: string;
  token: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: '',
  token: '',
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem('user', action.payload);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      localStorage.setItem('token', action.payload);
    },

    logout: (state) => {
      state.user = '';
      state.token = '';
      state.isAuthenticated = false;

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('refresh');
    },
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export const authSliceReducer = authSlice.reducer;
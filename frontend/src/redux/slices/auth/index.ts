import { createSlice } from '@reduxjs/toolkit';

import { login, register } from './thunks';
import { AuthState } from './types';

const initialState: AuthState = {
  isLoading: false,
  token: '',
  email: '',
  role: '',
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = '';
      state.email = '';
      state.role = '';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.email = action.payload.email;
        state.role = action.payload.role;
        state.isLoading = false;
      })
      .addCase(login.rejected, state => {
        state.isLoading = false;
      })
      .addCase(register.pending, state => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(register.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const { logout } = slice.actions;

export default slice;

import { createSlice } from '@reduxjs/toolkit';

import { login, register } from './thunks';
import { AuthState } from './types';

const initialState: AuthState = {
  isLoading: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, state => {
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

export default slice;

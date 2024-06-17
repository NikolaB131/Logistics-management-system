import { createSlice } from '@reduxjs/toolkit';

import { createClient, deleteClient, fetchClients } from './thunks';
import { ClientsState } from './types';

const initialState: ClientsState = {
  isLoading: false,
};

const slice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchClients.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchClients.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(fetchClients.rejected, state => {
        state.isLoading = false;
      })
      .addCase(createClient.pending, state => {
        state.isLoading = true;
      })
      .addCase(createClient.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(createClient.rejected, state => {
        state.isLoading = false;
      })
      .addCase(deleteClient.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteClient.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(deleteClient.rejected, state => {
        state.isLoading = false;
      });
  },
});

export default slice;

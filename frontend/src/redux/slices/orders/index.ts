import { createSlice } from '@reduxjs/toolkit';

import { createOrder, deleteOrder, fetchOrders } from './thunks';
import { OrdersState } from './types';

const initialState: OrdersState = {
  isLoading: false,
};

const slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(fetchOrders.rejected, state => {
        state.isLoading = false;
      })
      .addCase(createOrder.pending, state => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(createOrder.rejected, state => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteOrder.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(deleteOrder.rejected, state => {
        state.isLoading = false;
      });
  },
});

export default slice;

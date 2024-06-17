import { createSlice } from '@reduxjs/toolkit';

import { createItem, deleteItem, fetchItems } from './thunks';
import { WarehouseState } from './types';

const initialState: WarehouseState = {
  isLoading: false,
};

const slice = createSlice({
  name: 'warehouse',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchItems.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchItems.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(fetchItems.rejected, state => {
        state.isLoading = false;
      })
      .addCase(createItem.pending, state => {
        state.isLoading = true;
      })
      .addCase(createItem.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(createItem.rejected, state => {
        state.isLoading = false;
      })
      .addCase(deleteItem.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteItem.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(deleteItem.rejected, state => {
        state.isLoading = false;
      });
  },
});

export default slice;

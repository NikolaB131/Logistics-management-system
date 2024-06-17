import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { createCourier, deleteCourier, fetchCouriers } from './thunks';
import { CouriersState, MapInfo } from './types';

const initialState: CouriersState = {
  isLoading: false,
  mapInfo: [],
};

const slice = createSlice({
  name: 'couriers',
  initialState,
  reducers: {
    addToMap(state, action: PayloadAction<MapInfo>) {
      state.mapInfo.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCouriers.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchCouriers.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(fetchCouriers.rejected, state => {
        state.isLoading = false;
      })
      .addCase(createCourier.pending, state => {
        state.isLoading = true;
      })
      .addCase(createCourier.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(createCourier.rejected, state => {
        state.isLoading = false;
      })
      .addCase(deleteCourier.pending, state => {
        state.isLoading = true;
      })
      .addCase(deleteCourier.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(deleteCourier.rejected, state => {
        state.isLoading = false;
      });
  },
});

export const { addToMap } = slice.actions;

export default slice;

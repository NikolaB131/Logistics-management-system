import { combineSlices, configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/auth';
import clientsSlice from './slices/clients';
import couriersSlice from './slices/couriers';
import ordersSlice from './slices/orders';
import warehouseSlice from './slices/warehouse';

const rootReducer = combineSlices(authSlice, clientsSlice, ordersSlice, warehouseSlice, couriersSlice);

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

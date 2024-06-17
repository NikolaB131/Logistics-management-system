import { combineSlices, configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/auth';
import clientsSlice from './slices/clients';
import ordersSlice from './slices/orders';

const rootReducer = combineSlices(authSlice, clientsSlice, ordersSlice);

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { combineSlices, configureStore } from '@reduxjs/toolkit';

import authSlice from './slices/auth';

const rootReducer = combineSlices(authSlice);

export const store = configureStore({
  reducer: rootReducer,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

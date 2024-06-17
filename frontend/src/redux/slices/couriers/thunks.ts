import { createAppAsyncThunk } from '../../utils';
import { CourierGet, CourierPost } from './types';

export const fetchCouriers = createAppAsyncThunk<CourierGet[], void>(
  'couriers/fetchCouriers',
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/courier`);
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }

    return await response.json();
  },
);

export const createCourier = createAppAsyncThunk<void, CourierPost>(
  'couriers/createCourier',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/courier`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
  },
);

export const deleteCourier = createAppAsyncThunk<void, number>(
  'couriers/deleteCourier',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/courier/${payload}`, { method: 'DELETE' });
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
  },
);

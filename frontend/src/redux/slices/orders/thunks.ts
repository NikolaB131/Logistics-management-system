import { createAppAsyncThunk } from '../../utils';
import { OrderGet, OrderPost } from './types';

export const fetchOrders = createAppAsyncThunk<OrderGet[], void>(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/order`);
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }

    return await response.json();
  },
);

export const createOrder = createAppAsyncThunk<void, OrderPost>(
  'orders/createOrder',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/order`, {
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

export const deleteOrder = createAppAsyncThunk<void, number>(
  'orders/deleteOrder',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/order/${payload}`, { method: 'DELETE' });
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
  },
);

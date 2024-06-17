import { createAppAsyncThunk } from '../../utils';
import { ItemGet, ItemPost } from './types';

export const fetchItems = createAppAsyncThunk<ItemGet[], void>(
  'warehouse/fetchItems',
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/item`);
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }

    return await response.json();
  },
);

export const createItem = createAppAsyncThunk<void, ItemPost>(
  'warehouse/createItem',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/item`, {
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

export const deleteItem = createAppAsyncThunk<void, number>(
  'warehouse/deleteItem',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/item/${payload}`, { method: 'DELETE' });
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
  },
);

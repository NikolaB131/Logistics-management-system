import { createAppAsyncThunk } from '../../utils';
import { ClientGet, ClientPost } from './types';

export const fetchClients = createAppAsyncThunk<ClientGet[], void>(
  'clients/fetchClients',
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/client`);
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }

    return await response.json();
  },
);

export const createClient = createAppAsyncThunk<void, ClientPost>(
  'clients/createClient',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/client`, {
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

export const deleteClient = createAppAsyncThunk<void, number>(
  'clients/deleteClient',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/client/${payload}`, { method: 'DELETE' });
    if (!response.ok) {
      return rejectWithValue(await response.text());
    }
  },
);

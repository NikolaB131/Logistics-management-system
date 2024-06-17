import { createAppAsyncThunk } from '../../utils';
import { AuthCredentials, LoginResponse } from './types';

export const login = createAppAsyncThunk<LoginResponse, AuthCredentials>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }

    return await response.json();
  },
);

export const register = createAppAsyncThunk<void, AuthCredentials>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
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

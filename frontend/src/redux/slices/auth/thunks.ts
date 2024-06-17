import { createAppAsyncThunk } from '../../utils';
import { AuthCredentials, LogoutResult } from './types';

export const login = createAppAsyncThunk<void, AuthCredentials>('auth/login', async (payload, { rejectWithValue }) => {
  const response = await fetch(`${import.meta.env.API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    return rejectWithValue(await response.text());
  }
});

export const register = createAppAsyncThunk<void, AuthCredentials>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.API_URL}/auth/register`, {
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

export const logout = createAppAsyncThunk<LogoutResult>('auth/logout', async () => {
  const response = await fetch(`${import.meta.env.API_URL}/auth/logout`, { method: 'POST' });
  return { ok: response.ok };
});

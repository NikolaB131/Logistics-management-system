export type AuthState = {
  isLoading: boolean;
  token: string;
  email: string;
  role: string;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  email: string;
  role: string;
};

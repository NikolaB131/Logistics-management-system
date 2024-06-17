export type ClientsState = {
  isLoading: boolean;
};

export type ClientGet = {
  id: number;
  name: string;
  phone_number: string;
  notes: string;
};

export type ClientPost = {
  name: string;
  phone_number?: string;
  notes?: string;
};

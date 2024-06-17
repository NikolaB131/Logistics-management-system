export type MapInfo = {
  name: string;
  geo: number[];
};

export type CouriersState = {
  isLoading: boolean;
  mapInfo: MapInfo[];
};

export type CourierGet = {
  id: number;
  name: string;
  car_number: string;
  phone_number: string;
  status: string;
  notes: string;
};

export type CourierPost = {
  name: string;
  phone_number?: string;
  car_number?: string;
  notes?: string;
};

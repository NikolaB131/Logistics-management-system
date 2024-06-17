export type WarehouseState = {
  isLoading: boolean;
};

export type ItemGet = {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  last_supply_date: string;
};

export type ItemPost = {
  name: string;
  quantity: number;
  cost: number;
  last_supply_date?: string;
};

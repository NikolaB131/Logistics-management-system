export type OrdersState = {
  isLoading: boolean;
};

export type OrderItem = {
  id: number;
  quantity: number;
};

export type OrderGet = {
  id: number;
  courier_id: number;
  client_id: number;
  address_from: string;
  address_to: string;
  notes: string;
  status: string;
  created_at: string;
  deliver_to: string;
  delivered_at: string;
  items: OrderItem[];
  delivery_cost: number;
  total_cost: number;
};

export type OrderPost = {
  courier_id: number;
  client_id: number;
  address_from: string;
  address_to: string;
  notes?: string;
  deliver_to: string;
  items: OrderItem[];
  delivery_cost: number;
};

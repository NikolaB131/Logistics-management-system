import { AppState } from '../../store';

export const isOrdersLoadingSelector = (state: AppState) => state.orders.isLoading;

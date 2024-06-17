import { AppState } from '../../store';

export const isWarehouseLoadingSelector = (state: AppState) => state.warehouse.isLoading;

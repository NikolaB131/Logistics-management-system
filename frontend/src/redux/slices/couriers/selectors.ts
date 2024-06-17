import { AppState } from '../../store';

export const isCouriersLoadingSelector = (state: AppState) => state.couriers.isLoading;
export const couriersMapInfoSelector = (state: AppState) => state.couriers.mapInfo;

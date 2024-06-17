import { AppState } from '../../store';

export const isClientsLoadingSelector = (state: AppState) => state.clients.isLoading;

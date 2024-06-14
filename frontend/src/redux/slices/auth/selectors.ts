import { AppState } from '../../store';

export const isAuthLoadingSelector = (state: AppState) => state.auth.isLoading;

import { AppState } from '../../store';

export const isAuthLoadingSelector = (state: AppState) => state.auth.isLoading;
export const authTokenSelector = (state: AppState) => state.auth.token;
export const authEmailSelector = (state: AppState) => state.auth.email;
export const authRoleSelector = (state: AppState) => state.auth.role;

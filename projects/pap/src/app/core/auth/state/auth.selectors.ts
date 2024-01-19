import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const selectAuthState = createFeatureSelector<fromAuth.AuthState>(fromAuth.authFeatureKey);
export const isLogged = createSelector(selectAuthState, state => state != null && state.isLogged);
export const isVerified = createSelector(
  selectAuthState,
  state =>
    state != null &&
    (state.isVerified || (state.user != null && state.user!.email_verified_at != null)),
);
export const noAddress = createSelector(selectAuthState, state => state != null && state.noAddress);
export const noHouseNumber = createSelector(selectAuthState, state =>
  state != null && state.noHouseNumber ? state.noHouseNumber : undefined,
);
export const user = createSelector(selectAuthState, state => state.user);
export const error = createSelector(selectAuthState, state => state != null && state.error);

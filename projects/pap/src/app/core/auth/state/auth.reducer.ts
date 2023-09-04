import {createReducer, on} from '@ngrx/store';
import {User} from '../auth.model';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface AuthState {
  error?: string;
  isLogged: boolean;
  isVerified: boolean;
  noAddress: boolean;
  user?: User;
}

export const initialState: AuthState = {
  isLogged: false,
  noAddress: false,
  isVerified: false,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.loadAuths, state => state),
  on(AuthActions.loadAuthsSuccess, (state, action) => {
    return {
      ...state,
      user: action.user,
      isLogged: true,
      isVerified: action.user.email_verified_at != null ? true : false,
      noAddress: action.user.addresses == null || action.user.addresses.length === 0 ? true : false,
    };
  }),
  on(AuthActions.loadAuthsFailure, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      user: undefined,
      isLogged: false,
      isVerified: false,
      error: undefined,
    };
  }),
  on(AuthActions.logout, state => state),
  on(AuthActions.loadSignIns, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      isLogged: false,
      isVerified: false,
      error: undefined,
    };
  }),
  on(AuthActions.loadSignInsSuccess, (state, action) => {
    localStorage.setItem('access_token', action.user.data.token);
    return {
      ...state,
      isLogged: true,
      isVerified: action.user.data.email_verified_at != null ? true : false,
      error: undefined,
    };
  }),
  on(AuthActions.loadSignInsFailure, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      user: undefined,
      isLogged: false,
      isVerified: false,
      error: action.error.error.message,
    };
  }),
  on(AuthActions.loadSignUps, state => state),
  on(AuthActions.loadSignUpsSuccess, (state, action) => {
    localStorage.setItem('access_token', action.user.data.token);
    return {
      ...state,
      isLogged: true,
      isVerified: action.user.email_verified_at != null ? true : false,
      error: undefined,
    };
  }),
  on(AuthActions.loadSignUpsFailure, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      user: undefined,
      isLogged: false,
      isVerified: false,
      error: action.error.error.message,
    };
  }),
  on(AuthActions.UpdateUser, state => state),
  on(AuthActions.UpdateUserSuccess, (state, action) => {
    return {
      ...state,
      isLogged: true,
      isVerified: action.user.email_verified_at != null ? true : false,
      error: undefined,
      user: action.user.data.user,
    };
  }),
  on(AuthActions.UpdateUserFailure, (state, action) => {
    return {
      ...state,
      user: undefined,
      isLogged: false,
      isVerified: false,
      error: action.error.error.message,
    };
  }),
);

import {createReducer, on} from '@ngrx/store';
import {Address, User} from '../auth.model';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface AuthState {
  error?: string;
  isLogged: boolean;
  isVerified: boolean;
  noAddress: boolean;
  noHouseNumber?: Address[];
  user?: User;
}

export const initialState: AuthState = {
  isLogged: false,
  noAddress: false,
  isVerified: false,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.loadAuths, state => {
    return {
      ...state,
      error: undefined,
    };
  }),
  on(AuthActions.loadAuthsSuccess, (state, action) => {
    const noHouseNumber = action.user.addresses.filter(
      a => a.house_number == null || a.house_number == '',
    );
    return {
      ...state,
      user: action.user,
      isLogged: true,
      isVerified: action.user.email_verified_at != null ? true : false,
      noAddress: action.user.addresses == null || action.user.addresses.length === 0 ? true : false,
      noHouseNumber: noHouseNumber.length > 0 ? noHouseNumber : undefined,
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
  on(AuthActions.logout, state => {
    return {
      ...state,
      error: undefined,
    };
  }),
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
      user: action.user.data.user,
      isVerified: action.user.data.email_verified_at != null ? true : false,
      noAddress:
        action.user.data.user.addresses == null || action.user.addresses?.length === 0
          ? true
          : false,
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
      error: action.error,
    };
  }),
  on(AuthActions.loadSignUps, state => {
    return {
      ...state,
      error: undefined,
    };
  }),
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
      error: action.error,
    };
  }),
  on(AuthActions.UpdateUser, state => {
    return {
      ...state,
      error: undefined,
    };
  }),
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
      error: action.error,
    };
  }),
);

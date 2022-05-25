import {createReducer, on} from '@ngrx/store';
import {User} from '../auth.model';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface AuthState {
  isLogged: boolean;
  user?: User;
  error?: string;
}

export const initialState: AuthState = {
  isLogged: false,
};

export const reducer = createReducer(
  initialState,

  on(AuthActions.loadAuths, state => state),
  on(AuthActions.loadAuthsSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isLogged: true,
  })),
  on(AuthActions.loadAuthsFailure, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      user: undefined,
      isLogged: false,
      error: undefined,
    };
  }),
  on(AuthActions.loadSignIns, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      isLogged: false,
      error: undefined,
    };
  }),
  on(AuthActions.loadSignInsSuccess, (state, action) => {
    localStorage.setItem('access_token', action.user.data.token);
    return {
      ...state,
      isLogged: true,
      error: undefined,
    };
  }),
  on(AuthActions.loadSignInsFailure, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      user: undefined,
      isLogged: false,
      error: action.error.error.message,
    };
  }),
  on(AuthActions.loadSignUps, state => state),
  on(AuthActions.loadSignUpsSuccess, (state, action) => {
    localStorage.setItem('access_token', action.user.data.token);
    return {
      ...state,
      isLogged: true,
      error: undefined,
    };
  }),
  on(AuthActions.loadSignUpsFailure, (state, action) => {
    localStorage.removeItem('access_token');
    return {
      ...state,
      user: undefined,
      isLogged: false,
      error: action.error.error.message,
    };
  }),
);

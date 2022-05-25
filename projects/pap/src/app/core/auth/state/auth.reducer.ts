import {createReducer, on} from '@ngrx/store';
import {User} from '../auth.model';
import * as AuthActions from './auth.actions';

export const authFeatureKey = 'auth';

export interface AuthState {
  user?: User;
  isLogged: boolean;
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
  on(AuthActions.loadAuthsFailure, (state, action) => state),
);

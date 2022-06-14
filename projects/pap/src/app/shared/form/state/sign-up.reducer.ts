import {Action, createReducer, on} from '@ngrx/store';
import * as SignUpActions from './sign-up.actions';

export const signUpFeatureKey = 'signUp';

export interface State {
  userTypes: any[];
}

export const initialState: State = {
  userTypes: [],
};

export const reducer = createReducer(
  initialState,
  on(SignUpActions.loadUserTypes, state => state),
  on(SignUpActions.loadUserTypesSuccess, (state, action) => ({
    ...state,
    userTypes: action.userTypes,
  })),
  on(SignUpActions.loadUserTypesFailure, (state, action) => state),
);

import {createReducer, on} from '@ngrx/store';
import * as SignUpActions from './sign-up.actions';
import {UserType} from '../location/location.model';

export const signUpFeatureKey = 'signUp';

export interface State {
  userTypes: UserType[];
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

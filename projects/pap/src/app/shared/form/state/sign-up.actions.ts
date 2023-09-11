import {createAction, props} from '@ngrx/store';
import {UserType} from '../location/location.model';

export const loadUserTypes = createAction('[SignUp] load user types');

export const loadUserTypesSuccess = createAction(
  '[SignUp] load user types Success',
  props<{userTypes: UserType[]}>(),
);

export const loadUserTypesFailure = createAction(
  '[SignUp] load user types Failure',
  props<{error: string}>(),
);

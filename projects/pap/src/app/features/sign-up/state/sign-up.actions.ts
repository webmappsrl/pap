import {createAction, props} from '@ngrx/store';

export const loadUserTypes = createAction('[SignUp] load user types');

export const loadUserTypesSuccess = createAction(
  '[SignUp] load user types Success',
  props<{userTypes: any[]}>(),
);

export const loadUserTypesFailure = createAction(
  '[SignUp] load user types Failure',
  props<{error: any}>(),
);

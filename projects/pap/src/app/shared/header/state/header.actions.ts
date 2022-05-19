import {createAction, props} from '@ngrx/store';

export const loadHeaders = createAction('[Header] Load Headers');

export const loadHeadersSuccess = createAction(
  '[Header] Load Headers Success',
  props<{data: any}>(),
);

export const loadHeadersFailure = createAction(
  '[Header] Load Headers Failure',
  props<{error: any}>(),
);

export const openMenu = createAction('[Header] Open Menu');

export const closeMenu = createAction('[Header] Close Menu');

export const showButtons = createAction('[Header] Show Buttons', props<{show: boolean}>());

import {createAction, props} from '@ngrx/store';
import {headerInfo} from '../header.model';

export const loadHeaders = createAction('[Header] Load Headers');

export const loadHeadersSuccess = createAction(
  '[Header] Load Headers Success',
  props<{data: headerInfo}>(),
);

export const loadHeadersFailure = createAction(
  '[Header] Load Headers Failure',
  props<{error: string}>(),
);

export const openMenu = createAction('[Header] Open Menu');

export const closeMenu = createAction('[Header] Close Menu');

export const showButtons = createAction('[Header] Show Buttons', props<{show: boolean}>());

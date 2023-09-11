import {createAction, props} from '@ngrx/store';
import {footerInfo} from '../footer.model';

export const loadFooters = createAction('[Footer] Load Footers');

export const loadFootersSuccess = createAction(
  '[Footer] Load Footers Success',
  props<{data: footerInfo}>(),
);

export const loadFootersFailure = createAction(
  '[Footer] Load Footers Failure',
  props<{error: string}>(),
);

export const openMenu = createAction('[Footer] Open Menu');

export const closeMenu = createAction('[Footer] Close Menu');

export const showButtons = createAction('[Footer] Show Buttons', props<{show: boolean}>());

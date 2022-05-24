import { createAction, props } from '@ngrx/store';

export const loadWasteCenterDetails = createAction(
  '[WasteCenterDetail] Load WasteCenterDetails'
);

export const loadWasteCenterDetailsSuccess = createAction(
  '[WasteCenterDetail] Load WasteCenterDetails Success',
  props<{ data: any }>()
);

export const loadWasteCenterDetailsFailure = createAction(
  '[WasteCenterDetail] Load WasteCenterDetails Failure',
  props<{ error: any }>()
);

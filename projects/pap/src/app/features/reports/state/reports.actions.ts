import {createAction, props} from '@ngrx/store';

export const loadReportss = createAction('[Reports] Load Reportss');

export const loadReportssSuccess = createAction(
  '[Reports] Load Reportss Success',
  props<{reports: any[]}>(),
);

export const loadReportssFailure = createAction(
  '[Reports] Load Reportss Failure',
  props<{error: any}>(),
);

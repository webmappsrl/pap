import {createAction, props} from '@ngrx/store';
import {Ticket} from './reports.effects';

export const loadReportss = createAction('[Reports] Load Reportss');

export const loadReportssSuccess = createAction(
  '[Reports] Load Reportss Success',
  props<{reports: Ticket[]}>(),
);

export const loadReportssFailure = createAction(
  '[Reports] Load Reportss Failure',
  props<{error: string}>(),
);

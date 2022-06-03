import {createAction, props} from '@ngrx/store';

export const loadReportTickets = createAction('[ReportTicket] Load ReportTickets');

export const loadReportTicketsSuccess = createAction(
  '[ReportTicket] Load ReportTickets Success',
  props<{data: any}>(),
);

export const loadReportTicketsFailure = createAction(
  '[ReportTicket] Load ReportTickets Failure',
  props<{error: any}>(),
);

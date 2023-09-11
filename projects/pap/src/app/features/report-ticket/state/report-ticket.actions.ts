import {createAction, props} from '@ngrx/store';
import {SuccessResponse} from '../../../shared/form/model';

export const loadReportTickets = createAction('[ReportTicket] Load ReportTickets');

export const loadReportTicketsSuccess = createAction(
  '[ReportTicket] Load ReportTickets Success',
  props<{data: SuccessResponse}>(),
);

export const loadReportTicketsFailure = createAction(
  '[ReportTicket] Load ReportTickets Failure',
  props<{error: string}>(),
);

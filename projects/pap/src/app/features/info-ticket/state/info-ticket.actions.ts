import {createAction, props} from '@ngrx/store';

export const loadInfoTickets = createAction('[InfoTicket] Load InfoTickets');

export const loadInfoTicketsSuccess = createAction(
  '[InfoTicket] Load InfoTickets Success',
  props<{data: any}>(),
);

export const loadInfoTicketsFailure = createAction(
  '[InfoTicket] Load InfoTickets Failure',
  props<{error: any}>(),
);
export const sendReportInfoTickets = createAction(
  '[InfoTicket] sendReport InfoTickets',
  props<{data: any}>(),
);

export const sendReportInfoTicketsSuccess = createAction(
  '[InfoTicket] sendReport InfoTickets Success',
  props<{data: any}>(),
);

export const sendReportInfoTicketsFailure = createAction(
  '[InfoTicket] sendReport InfoTickets Failure',
  props<{error: any}>(),
);

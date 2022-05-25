import { createAction, props } from '@ngrx/store';

export const loadInfoTickets = createAction(
  '[InfoTicket] Load InfoTickets'
);

export const loadInfoTicketsSuccess = createAction(
  '[InfoTicket] Load InfoTickets Success',
  props<{ data: any }>()
);

export const loadInfoTicketsFailure = createAction(
  '[InfoTicket] Load InfoTickets Failure',
  props<{ error: any }>()
);

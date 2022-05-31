import { createAction, props } from '@ngrx/store';

export const loadAbandonmentTickets = createAction(
  '[AbandonmentTicket] Load AbandonmentTickets'
);

export const loadAbandonmentTicketsSuccess = createAction(
  '[AbandonmentTicket] Load AbandonmentTickets Success',
  props<{ data: any }>()
);

export const loadAbandonmentTicketsFailure = createAction(
  '[AbandonmentTicket] Load AbandonmentTickets Failure',
  props<{ error: any }>()
);

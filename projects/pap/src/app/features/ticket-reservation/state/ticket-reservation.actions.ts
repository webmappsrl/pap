import { createAction, props } from '@ngrx/store';

export const loadTicketReservations = createAction(
  '[TicketReservation] Load TicketReservations'
);

export const loadTicketReservationsSuccess = createAction(
  '[TicketReservation] Load TicketReservations Success',
  props<{ data: any }>()
);

export const loadTicketReservationsFailure = createAction(
  '[TicketReservation] Load TicketReservations Failure',
  props<{ error: any }>()
);

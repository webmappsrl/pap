import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTicketReservation from './ticket-reservation.reducer';

export const selectTicketReservationState = createFeatureSelector<fromTicketReservation.State>(
  fromTicketReservation.ticketReservationFeatureKey
);

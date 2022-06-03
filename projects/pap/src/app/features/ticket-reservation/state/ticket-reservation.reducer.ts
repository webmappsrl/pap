import {Action, createReducer, on} from '@ngrx/store';
import * as TicketReservationActions from './ticket-reservation.actions';

export const ticketReservationFeatureKey = 'ticketReservation';

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(TicketReservationActions.loadTicketReservations, state => state),
  on(TicketReservationActions.loadTicketReservationsSuccess, (state, action) => state),
  on(TicketReservationActions.loadTicketReservationsFailure, (state, action) => state),
);

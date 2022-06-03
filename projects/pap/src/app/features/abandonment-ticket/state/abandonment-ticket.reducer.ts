import {Action, createReducer, on} from '@ngrx/store';
import * as AbandonmentTicketActions from './abandonment-ticket.actions';

export const abandonmentTicketFeatureKey = 'abandonmentTicket';

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(AbandonmentTicketActions.loadAbandonmentTickets, state => state),
  on(AbandonmentTicketActions.loadAbandonmentTicketsSuccess, (state, action) => state),
  on(AbandonmentTicketActions.loadAbandonmentTicketsFailure, (state, action) => state),
);

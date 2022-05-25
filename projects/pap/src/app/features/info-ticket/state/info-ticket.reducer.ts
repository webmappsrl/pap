import { Action, createReducer, on } from '@ngrx/store';
import * as InfoTicketActions from './info-ticket.actions';

export const infoTicketFeatureKey = 'infoTicket';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,

  on(InfoTicketActions.loadInfoTickets, state => state),
  on(InfoTicketActions.loadInfoTicketsSuccess, (state, action) => state),
  on(InfoTicketActions.loadInfoTicketsFailure, (state, action) => state),

);

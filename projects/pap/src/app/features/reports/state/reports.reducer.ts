import {createReducer, on} from '@ngrx/store';
import * as ReportsActions from './reports.actions';
import {Ticket} from './reports.effects';

export const reportsFeatureKey = 'reports';

export interface State {
  lastTicketSelected?: Ticket;
  lastTicketUpdate?: Ticket;
  reports: Ticket[];
  ticketById?: Ticket;
}

export const initialState: State = {
  reports: [],
};

export const reducer = createReducer(
  initialState,

  on(ReportsActions.loadTickets, state => state),
  on(ReportsActions.loadTicketsSuccess, (state, action) => {
    return {
      ...state,
      reports: action.reports,
    };
  }),
  on(ReportsActions.loadTicketsFailure, (state, action) => state),
  on(ReportsActions.updateTicketSuccess, (state, action) => {
    const ticket = action.ticket;
    const reports = state.reports.filter(t => t.id != ticket.id);
    return {
      ...state,
      reports,
      lastTicketUpdate: ticket,
    };
  }),
  on(ReportsActions.updateTicketFailure, (state, action) => {
    return {
      ...state,
      lastTicketUpdate: undefined,
    };
  }),
  on(ReportsActions.selectTicketById, (state, action) => {
    return {
      ...state,
      lastTicketSelected: state.reports.filter(r => r.id === +action.id)[0] ?? undefined,
    };
  }),
);

import {createReducer, on} from '@ngrx/store';
import * as InfoTicketActions from './info-ticket.actions';

export const infoTicketFeatureKey = 'infoTicket';

export interface InfoTicketState {
  reportSend: boolean;
}

export const initialState: InfoTicketState = {
  reportSend: false,
};

export const reducer = createReducer(
  initialState,

  on(InfoTicketActions.loadInfoTickets, state => ({
    ...state,
    reportSend: false,
  })),
  on(InfoTicketActions.loadInfoTicketsSuccess, (state, action) => state),
  on(InfoTicketActions.loadInfoTicketsFailure, (state, action) => state),

  on(InfoTicketActions.sendReportInfoTickets, state => state),
  on(InfoTicketActions.sendReportInfoTicketsSuccess, (state, action) => ({
    ...state,
    reportSend: action.data.reportSend,
  })),
  on(InfoTicketActions.sendReportInfoTicketsFailure, (state, action) => state),
);

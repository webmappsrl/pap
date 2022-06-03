import {Action, createReducer, on} from '@ngrx/store';
import * as ReportTicketActions from './report-ticket.actions';

export const reportTicketFeatureKey = 'reportTicket';

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(ReportTicketActions.loadReportTickets, state => state),
  on(ReportTicketActions.loadReportTicketsSuccess, (state, action) => state),
  on(ReportTicketActions.loadReportTicketsFailure, (state, action) => state),
);

import {createFeatureSelector} from '@ngrx/store';
import * as fromReportTicket from './report-ticket.reducer';

export const selectReportTicketState = createFeatureSelector<fromReportTicket.State>(
  fromReportTicket.reportTicketFeatureKey,
);

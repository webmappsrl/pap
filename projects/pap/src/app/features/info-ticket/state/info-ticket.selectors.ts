import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromInfoTicket from './info-ticket.reducer';

export const selectInfoTicketState = createFeatureSelector<fromInfoTicket.InfoTicketState>(
  fromInfoTicket.infoTicketFeatureKey,
);

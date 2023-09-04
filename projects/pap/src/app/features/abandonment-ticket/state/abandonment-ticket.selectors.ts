import {createFeatureSelector} from '@ngrx/store';
import * as fromAbandonmentTicket from './abandonment-ticket.reducer';

export const selectAbandonmentTicketState = createFeatureSelector<fromAbandonmentTicket.State>(
  fromAbandonmentTicket.abandonmentTicketFeatureKey,
);

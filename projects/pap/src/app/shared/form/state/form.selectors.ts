import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromTicket from './form.reducer';

export const selectTicketState = createFeatureSelector<fromTicket.TicketState>(
  fromTicket.ticketFeatureKey,
);
export const ticketError = createSelector(selectTicketState, state => state != null && state.error);
export const ticketSuccess = createSelector(
  selectTicketState,
  state => state != null && state.success,
);
export const ticketLoading = createSelector(
  selectTicketState,
  state => state != null && state.loading,
);

export const currentTrashBookType = createSelector(
  selectTicketState,
  state => state.currentTrashBookType,
);

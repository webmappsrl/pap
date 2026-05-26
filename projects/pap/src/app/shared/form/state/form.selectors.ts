import {createFeatureSelector, createSelector} from '@ngrx/store';
import {TicketType} from '../model';
import {
  TicketFormConf,
  reportTicketForm,
  abandonmentTicketForm,
  ticketReservationForm,
  infoTicketForm,
} from '../../models/form.model';
import * as fromTicket from './form.reducer';

const FALLBACK_CONFIGS: {[key: string]: TicketFormConf} = {
  report: reportTicketForm,
  abandonment: abandonmentTicketForm,
  reservation: ticketReservationForm,
  info: infoTicketForm,
};

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

export const selectTicketFormsConfigs = createSelector(
  selectTicketState,
  state => state.ticketFormsConfigs,
);

export const selectTicketFormConfByType = (ticketType: TicketType) =>
  createSelector(
    selectTicketFormsConfigs,
    configs => (configs?.[ticketType] ?? FALLBACK_CONFIGS[ticketType]) as TicketFormConf,
  );

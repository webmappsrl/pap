import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromReports from './reports.reducer';
import {Ticket} from '../../reports/state/reports.effects';

export const selectReportsState = createFeatureSelector<fromReports.State>(
  fromReports.reportsFeatureKey,
);
export const selectReports = createSelector(selectReportsState, state => state.reports);

export const lastTicketUpdate = createSelector(selectReportsState, state => state.lastTicketUpdate);

export const selectReportById = createSelector(
  selectReportsState,
  state => state.lastTicketSelected,
);

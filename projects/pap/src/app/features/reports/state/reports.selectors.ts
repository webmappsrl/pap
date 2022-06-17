import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromReports from './reports.reducer';

export const selectReportsState = createFeatureSelector<fromReports.State>(
  fromReports.reportsFeatureKey,
);
export const selectReports = createSelector(selectReportsState, state => state.reports);

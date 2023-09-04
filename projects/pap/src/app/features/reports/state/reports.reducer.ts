import {createReducer, on} from '@ngrx/store';
import * as ReportsActions from './reports.actions';
import {Ticket} from './reports.effects';

export const reportsFeatureKey = 'reports';

export interface State {
  reports: Ticket[];
}

export const initialState: State = {
  reports: [],
};

export const reducer = createReducer(
  initialState,

  on(ReportsActions.loadReportss, state => state),
  on(ReportsActions.loadReportssSuccess, (state, action) => {
    return {
      ...state,
      reports: action.reports,
    };
  }),
  on(ReportsActions.loadReportssFailure, (state, action) => state),
);

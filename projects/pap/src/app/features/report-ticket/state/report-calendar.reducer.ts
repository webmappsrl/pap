import {createReducer, on} from '@ngrx/store';
import {Calendar} from '../../calendar/calendar.model';
import * as ReportCalendarActions from './report-calendar.actions';

export const reportCalendarFeatureKey = 'reportCalendar';

export interface ReportCalendarState {
  calendars?: Calendar[];
  loading: boolean;
  error: string;
}

export const initialState: ReportCalendarState = {
  loading: false,
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(ReportCalendarActions.loadReportCalendars, state => ({
    ...state,
    loading: true,
  })),
  on(ReportCalendarActions.loadReportCalendarsSuccess, (state, action) => ({
    ...state,
    calendars: action.calendars,
    loading: false,
  })),
  on(ReportCalendarActions.loadReportCalendarsFailure, (state, action) => ({
    ...state,
    error: action.error,
    loading: false,
  })),
);

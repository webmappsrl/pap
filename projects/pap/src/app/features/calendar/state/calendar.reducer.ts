import {createReducer, on} from '@ngrx/store';
import {Calendar} from '../calendar.model';
import * as CalendarActions from './calendar.actions';

export const calendarFeatureKey = 'calendar';

export interface CalendarState {
  calendars?: Calendar[];
  error: string;
}

export const initialState: CalendarState = {
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(CalendarActions.loadCalendars, state => state),
  on(CalendarActions.loadCalendarsSuccess, (state, action) => ({
    ...state,
    calendars: action.calendars,
  })),
  on(CalendarActions.loadCalendarsFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
);

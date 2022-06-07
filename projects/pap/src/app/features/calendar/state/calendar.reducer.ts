import {Action, createReducer, on} from '@ngrx/store';
import {Calendar} from '../calendar.model';
import * as CalendarActions from './calendar.actions';

export const calendarFeatureKey = 'calendar';

export interface CalendarState {
  calendar?: Calendar;
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
    calendar: action.calendar,
  })),
  on(CalendarActions.loadCalendarsFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
);

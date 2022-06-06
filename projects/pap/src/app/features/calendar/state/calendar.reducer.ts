import { Action, createReducer, on } from '@ngrx/store';
import * as CalendarActions from './calendar.actions';

export const calendarFeatureKey = 'calendar';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,

  on(CalendarActions.loadCalendars, state => state),
  on(CalendarActions.loadCalendarsSuccess, (state, action) => state),
  on(CalendarActions.loadCalendarsFailure, (state, action) => state),

);

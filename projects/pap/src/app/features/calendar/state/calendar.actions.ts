import {createAction, props} from '@ngrx/store';
import {Calendar} from '../calendar.model';

export const loadCalendars = createAction(
  '[Calendar] Load Calendars',
  (prop: {start_date: string; stop_date: string} | null = null) => ({prop}),
);

export const loadCalendarsSuccess = createAction(
  '[Calendar] Load Calendars Success',
  props<{calendars: Calendar[]}>(),
);

export const loadCalendarsFailure = createAction(
  '[Calendar] Load Calendars Failure',
  props<{error: any}>(),
);

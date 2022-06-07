import {createAction, props} from '@ngrx/store';
import {Calendar} from '../calendar.model';

export const loadCalendars = createAction('[Calendar] Load Calendars');

export const loadCalendarsSuccess = createAction(
  '[Calendar] Load Calendars Success',
  props<{calendar: Calendar}>(),
);

export const loadCalendarsFailure = createAction(
  '[Calendar] Load Calendars Failure',
  props<{error: any}>(),
);

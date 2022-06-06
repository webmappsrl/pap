import { createAction, props } from '@ngrx/store';

export const loadCalendars = createAction(
  '[Calendar] Load Calendars'
);

export const loadCalendarsSuccess = createAction(
  '[Calendar] Load Calendars Success',
  props<{ data: any }>()
);

export const loadCalendarsFailure = createAction(
  '[Calendar] Load Calendars Failure',
  props<{ error: any }>()
);

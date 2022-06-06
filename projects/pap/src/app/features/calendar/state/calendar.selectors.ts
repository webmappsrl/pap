import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCalendar from './calendar.reducer';

export const selectCalendarState = createFeatureSelector<fromCalendar.State>(
  fromCalendar.calendarFeatureKey
);

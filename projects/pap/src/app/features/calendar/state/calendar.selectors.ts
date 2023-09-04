import {createFeatureSelector} from '@ngrx/store';
import * as fromCalendar from './calendar.reducer';

export const selectCalendarState = createFeatureSelector<fromCalendar.CalendarState>(
  fromCalendar.calendarFeatureKey,
);

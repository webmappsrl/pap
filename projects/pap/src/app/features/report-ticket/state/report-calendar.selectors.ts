import {createFeatureSelector} from '@ngrx/store';
import * as fromReportCalendar from './report-calendar.reducer';

export const selectReportCalendarState =
  createFeatureSelector<fromReportCalendar.ReportCalendarState>(
    fromReportCalendar.reportCalendarFeatureKey,
  );

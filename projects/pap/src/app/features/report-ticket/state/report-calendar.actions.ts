import {createAction, props} from '@ngrx/store';
import {Calendar} from '../../calendar/calendar.model';

export const loadReportCalendars = createAction(
  '[ReportCalendar] Load Report Calendars',
  (prop: {start_date: string; stop_date: string; exclude_in_progress?: boolean} | null = null) => ({
    prop,
  }),
);

export const loadReportCalendarsSuccess = createAction(
  '[ReportCalendar] Load Report Calendars Success',
  props<{calendars: Calendar[]}>(),
);

export const loadReportCalendarsFailure = createAction(
  '[ReportCalendar] Load Report Calendars Failure',
  props<{error: string}>(),
);

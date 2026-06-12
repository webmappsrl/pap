import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store, select} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {isLogged} from '../../../core/auth/state/auth.selectors';
import {AppState} from '../../../core/core.state';
import {CalendarService} from '../../calendar/calendar.service';
import * as ReportCalendarActions from './report-calendar.actions';

@Injectable()
export class ReportCalendarEffects {
  loadReportCalendars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReportCalendarActions.loadReportCalendars),
      withLatestFrom(this._store.pipe(select(isLogged))),
      filter(([, logged]) => !!logged),
      switchMap(([action]) =>
        this._calendarService.getCalendars(action.prop!).pipe(
          map(calendars => ReportCalendarActions.loadReportCalendarsSuccess({calendars})),
          catchError(error => of(ReportCalendarActions.loadReportCalendarsFailure({error}))),
        ),
      ),
    ),
  );

  constructor(
    private actions$: Actions,
    private _calendarService: CalendarService,
    private _store: Store<AppState>,
  ) {}
}

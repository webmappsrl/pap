import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, filter, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

import * as CalendarActions from './calendar.actions';
import * as TrashBookAction from '../../trash-book/state/trash-book.actions';
import {CalendarService} from '../calendar.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../core/core.state';
import {trashBookTypes} from '../../trash-book/state/trash-book.selectors';
import {isLogged} from '../../../core/auth/state/auth.selectors';

@Injectable()
export class CalendarEffects {
  isLogged$ = this._store.pipe(select(isLogged));
  loadCalendars$ = createEffect(() => {
    return this.isLogged$.pipe(
      filter(l => l),
      switchMap(_ => this.actions$),
      ofType(TrashBookAction.loadTrashBooksSuccess),
      switchMap(() => of({type: '[Calendar] Load Calendars'})),
      ofType(CalendarActions.loadCalendars),
      switchMap(action => {
        console.log(action);
        return this.calendarService.getCalendars();
      }),
      map(calendars => {
        return CalendarActions.loadCalendarsSuccess({calendars});
      }),
      catchError(error => of(CalendarActions.loadCalendarsFailure({error}))),
    );
  });
  loadCalendarsWithDate$ = createEffect(() => {
    return this.isLogged$.pipe(
      filter(l => l),
      switchMap(_ => this.actions$),
      ofType(CalendarActions.loadCalendars),
      switchMap(action => {
        return this.calendarService.getCalendars(action.prop!);
      }),
      map(calendars => {
        return CalendarActions.loadCalendarsSuccess({calendars});
      }),
      catchError(error => of(CalendarActions.loadCalendarsFailure({error}))),
    );
  });

  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private _store: Store<AppState>,
  ) {}
}

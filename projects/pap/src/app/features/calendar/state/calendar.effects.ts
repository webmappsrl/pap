import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {of} from 'rxjs';

import * as CalendarActions from './calendar.actions';
import {CalendarService} from '../calendar.service';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../core/core.state';
import {trashBookTypes} from '../../trash-book/state/trash-book.selectors';

@Injectable()
export class CalendarEffects {
  constructor(
    private actions$: Actions,
    private calendarService: CalendarService,
    private store: Store<AppState>,
  ) {}

  loadCalendars$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalendarActions.loadCalendars),
      switchMap(_ => this.calendarService.getCalendar()),
      withLatestFrom(this.store.pipe(select(trashBookTypes))),
      map(([calendar, trashTypes]) => {
        for (let k in calendar) {
          if (calendar[k]) {
            calendar[k].map(event => {
              event.trash_objects = [];
              event.trash_types.forEach(x => {
                const trashBookType = trashTypes.find(tt => tt.id === x);
                if (trashBookType) {
                  event.trash_objects?.push(trashBookType);
                }
              });
              return event;
            });
          }
        }
        return CalendarActions.loadCalendarsSuccess({calendar});
      }),
      catchError(error => of(CalendarActions.loadCalendarsFailure({error}))),
    );
  });
}

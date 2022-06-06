import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap, switchMap} from 'rxjs/operators';
import {Observable, EMPTY, of, forkJoin} from 'rxjs';

import * as CalendarActions from './calendar.actions';
import {CalendarService} from '../calendar.service';
import {TrashBookService} from '../../trash-book/state/trash-book.service';

@Injectable()
export class CalendarEffects {
  constructor(private actions$: Actions, private calendarService: CalendarService) {}

  loadCalendars$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(CalendarActions.loadCalendars),
      switchMap(_ =>
        forkJoin([this.calendarService.getCalendar(), this.calendarService.getTrashTypes()]),
      ),
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

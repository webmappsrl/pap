import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as CalendarActions from './calendar.actions';



@Injectable()
export class CalendarEffects {

  loadCalendars$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(CalendarActions.loadCalendars),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => CalendarActions.loadCalendarsSuccess({ data })),
          catchError(error => of(CalendarActions.loadCalendarsFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import * as TicketReservationActions from './ticket-reservation.actions';

@Injectable()
export class TicketReservationEffects {
  loadTicketReservations$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TicketReservationActions.loadTicketReservations),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => TicketReservationActions.loadTicketReservationsSuccess({data})),
          catchError(error => of(TicketReservationActions.loadTicketReservationsFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}

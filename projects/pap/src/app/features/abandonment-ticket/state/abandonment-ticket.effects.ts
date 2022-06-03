import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as AbandonmentTicketActions from './abandonment-ticket.actions';

@Injectable()
export class AbandonmentTicketEffects {
  loadAbandonmentTickets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AbandonmentTicketActions.loadAbandonmentTickets),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => AbandonmentTicketActions.loadAbandonmentTicketsSuccess({data})),
          catchError(error => of(AbandonmentTicketActions.loadAbandonmentTicketsFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}

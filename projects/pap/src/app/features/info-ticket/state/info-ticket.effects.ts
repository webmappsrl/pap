import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as InfoTicketActions from './info-ticket.actions';



@Injectable()
export class InfoTicketEffects {

  loadInfoTickets$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(InfoTicketActions.loadInfoTickets),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => InfoTicketActions.loadInfoTicketsSuccess({ data })),
          catchError(error => of(InfoTicketActions.loadInfoTicketsFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}

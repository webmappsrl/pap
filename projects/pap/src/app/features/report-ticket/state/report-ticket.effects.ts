import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as ReportTicketActions from './report-ticket.actions';



@Injectable()
export class ReportTicketEffects {

  loadReportTickets$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(ReportTicketActions.loadReportTickets),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => ReportTicketActions.loadReportTicketsSuccess({ data })),
          catchError(error => of(ReportTicketActions.loadReportTicketsFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}

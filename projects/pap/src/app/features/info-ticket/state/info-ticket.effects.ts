import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as InfoTicketActions from './info-ticket.actions';
import {ReportService} from '../../../services/report.service';

@Injectable()
export class InfoTicketEffects {
  loadInfoTickets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InfoTicketActions.loadInfoTickets),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => InfoTicketActions.loadInfoTicketsSuccess({data})),
          catchError(error => of(InfoTicketActions.loadInfoTicketsFailure({error}))),
        ),
      ),
    );
  });

  sendReportInfoTickets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InfoTicketActions.sendReportInfoTickets),
      concatMap(data => {
        console.log(
          '------- ~ InfoTicketEffects ~ sendReportInfoTickets$=createEffect ~ data',
          data,
        );
        return this.reportService.sendReport(data).pipe(
          map(_ => InfoTicketActions.sendReportInfoTicketsSuccess({data: {reportSend: true}})),
          catchError(error => of(InfoTicketActions.sendReportInfoTicketsFailure({error}))),
        );
      }),
    );
  });

  constructor(private actions$: Actions, private reportService: ReportService) {}
}

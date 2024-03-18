import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store, select} from '@ngrx/store';
import {of} from 'rxjs';
import {catchError, concatMap, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {AppState} from '../../../core/core.state';
import {Ticket as BaseTicket} from '../../../shared/form/model';
import {trashBookTypes} from '../../trash-book/state/trash-book.selectors';
import {TrashBookType} from '../../trash-book/trash-book-model';
import * as ReportsActions from './reports.actions';
import {ReportsService} from '../../../shared/services/reports.service';

export interface Ticket extends BaseTicket {
  created_at: string;
  trashType: TrashBookType;
}

@Injectable()
export class ReportsEffects {
  loadTickets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsActions.loadTickets),
      switchMap(_ => this._reportsSvc.getReports()),
      withLatestFrom(this.store.pipe(select(trashBookTypes))),
      map(([reports, trashTypes]) => {
        const res: Ticket[] = (reports as Ticket[]).map(r => {
          if (r.trash_type_id != null) {
            const trashType = trashTypes.filter(t => t.id === r.trash_type_id);
            if (trashType.length > 0) {
              r.trashType = trashType[0];
            }
          }
          return r;
        });
        return ReportsActions.loadTicketsSuccess({reports: res});
      }),
      catchError(error => of(ReportsActions.loadTicketsFailure({error}))),
    );
  });
  updateTicket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsActions.updateTicket),
      concatMap(ticket => {
        return this._reportsSvc.updateTicket(ticket.data).pipe(
          map(ticket => ReportsActions.updateTicketSuccess({ticket})),
          catchError(error => of(ReportsActions.updateTicketFailure({error}))),
        );
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private _reportsSvc: ReportsService,
    private store: Store<AppState>,
  ) {}
}

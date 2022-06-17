import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as ReportsActions from './reports.actions';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../core/core.state';
import {ReportsService} from '../reports.service';
import {trashBookTypes} from '../../trash-book/state/trash-book.selectors';
import {Ticket as BaseTicket} from '../../../shared/form/model';
import {TrashBookType} from '../../trash-book/trash-book-model';
export interface Ticket extends BaseTicket {
  trashType: TrashBookType;
  created_at: string;
}

@Injectable()
export class ReportsEffects {
  loadReportss$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ReportsActions.loadReportss),
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
        return ReportsActions.loadReportssSuccess({reports: res});
      }),
      catchError(error => of(ReportsActions.loadReportssFailure({error}))),
    );
  });

  constructor(
    private actions$: Actions,
    private _reportsSvc: ReportsService,
    private store: Store<AppState>,
  ) {}
}

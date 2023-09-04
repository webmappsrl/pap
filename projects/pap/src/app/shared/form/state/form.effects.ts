import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import * as TicketActions from './form.actions';
import {TicketService} from './form.service';

@Injectable()
export class FormEffects {
  sendTicket$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TicketActions.sendTicket),
      switchMap(action => this._ticketSvc.sendTicket(action.ticket)),
      map(res => TicketActions.sendTicketSuccess({res})),
      catchError(err => of(TicketActions.sendTicketFailure({err: err.error.message}))),
    );
  });

  constructor(private actions$: Actions, private _ticketSvc: TicketService) {}
}

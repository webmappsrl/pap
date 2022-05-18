import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap, switchMap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as TrashBookActions from './trash-book.actions';
import {TrashBookService} from './trash-book.service';

@Injectable()
export class TrashBookEffects {
  loadTrashBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrashBookActions.loadTrashBooks),
      switchMap(_ => this._trashBookSvc.getTrashBook()),
      map(data => TrashBookActions.loadTrashBooksSuccess({data})),
      catchError(error => of(TrashBookActions.loadTrashBooksFailure({error}))),
    );
  });

  constructor(private actions$: Actions, private _trashBookSvc: TrashBookService) {}
}

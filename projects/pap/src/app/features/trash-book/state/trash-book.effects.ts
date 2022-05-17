import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as TrashBookActions from './trash-book.actions';

@Injectable()
export class TrashBookEffects {
  loadTrashBooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TrashBookActions.loadTrashBooks),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => TrashBookActions.loadTrashBooksSuccess({data})),
          catchError(error => of(TrashBookActions.loadTrashBooksFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}

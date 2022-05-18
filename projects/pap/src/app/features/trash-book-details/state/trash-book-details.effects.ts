import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as TrashBookDetailsActions from './trash-book-details.actions';



@Injectable()
export class TrashBookDetailsEffects {

  loadTrashBookDetailss$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(TrashBookDetailsActions.loadTrashBookDetailss),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => TrashBookDetailsActions.loadTrashBookDetailssSuccess({ data })),
          catchError(error => of(TrashBookDetailsActions.loadTrashBookDetailssFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as WasteCenterDetailActions from './waste-center-detail.actions';



@Injectable()
export class WasteCenterDetailEffects {

  loadWasteCenterDetails$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(WasteCenterDetailActions.loadWasteCenterDetails),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => WasteCenterDetailActions.loadWasteCenterDetailsSuccess({ data })),
          catchError(error => of(WasteCenterDetailActions.loadWasteCenterDetailsFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}

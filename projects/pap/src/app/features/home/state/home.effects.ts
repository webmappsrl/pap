import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as HomeActions from './home.actions';



@Injectable()
export class HomeEffects {

  yHomes$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(HomeActions.yHomes),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => HomeActions.yHomesSuccess({ data })),
          catchError(error => of(HomeActions.yHomesFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';

import * as MapActions from './map.actions';



@Injectable()
export class MapEffects {

  loadMaps$ = createEffect(() => {
    return this.actions$.pipe( 

      ofType(MapActions.loadMaps),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => MapActions.loadMapsSuccess({ data })),
          catchError(error => of(MapActions.loadMapsFailure({ error }))))
      )
    );
  });



  constructor(private actions$: Actions) {}

}

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EMPTY, of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import * as InfoActions from './info.actions';

@Injectable()
export class InfoEffects {
  loadInfos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(InfoActions.loadInfos),
      concatMap(() =>
        /** An EMPTY observable only emits completion. Replace with your own observable API request */
        EMPTY.pipe(
          map(data => InfoActions.loadInfosSuccess({data})),
          catchError(error => of(InfoActions.loadInfosFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}

import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {of} from 'rxjs';
import {catchError, concatMap, map} from 'rxjs/operators';
import {homeButtons} from '../home.model';
import * as HomeActions from './home.actions';

@Injectable()
export class HomeEffects {
  yHomes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(HomeActions.yHomes),
      concatMap(() =>
        of(homeButtons).pipe(
          map(buttons => HomeActions.yHomesSuccess({buttons})),
          catchError(error => of(HomeActions.yHomesFailure({error}))),
        ),
      ),
    );
  });

  constructor(private actions$: Actions) {}
}

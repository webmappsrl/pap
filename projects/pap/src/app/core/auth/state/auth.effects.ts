import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap, switchMap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as AuthActions from './auth.actions';
import {AuthService} from './auth.service';

@Injectable()
export class AuthEffects {
  loadAuths$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadAuths),
      switchMap(_ => this._authSvc.getUser()),
      map(user => AuthActions.loadAuthsSuccess({user})),
      catchError(error => {
        return of(AuthActions.loadAuthsFailure({error}));
      }),
    );
  });

  constructor(private actions$: Actions, private _authSvc: AuthService) {}
}

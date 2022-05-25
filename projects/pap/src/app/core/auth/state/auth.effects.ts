import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, concatMap, switchMap, tap} from 'rxjs/operators';
import {Observable, EMPTY, of} from 'rxjs';

import * as AuthActions from './auth.actions';
import {AuthService} from './auth.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../core.state';

@Injectable()
export class AuthEffects {
  loadAuths$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadAuths),
      switchMap(_ =>
        this._authSvc.getUser().pipe(
          map(user => AuthActions.loadAuthsSuccess({user})),
          catchError(error => {
            return of(AuthActions.loadAuthsFailure({error}));
          }),
        ),
      ),
    );
  });

  loadSignin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadSignIns),
      switchMap(action =>
        this._authSvc.login(action).pipe(
          map(user => AuthActions.loadSignInsSuccess({user})),
          catchError(error => {
            return of(AuthActions.loadSignInsFailure({error}));
          }),
        ),
      ),
    );
  });

  loadSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadSignUps),
      switchMap(action =>
        this._authSvc.register(action).pipe(
          map(user => AuthActions.loadSignUpsSuccess({user})),
          catchError(error => {
            return of(AuthActions.loadSignUpsFailure({error}));
          }),
        ),
      ),
    );
  });

  constructor(private actions$: Actions, private _authSvc: AuthService) {}
}

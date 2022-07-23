import * as AuthActions from './auth.actions';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AlertController, AlertOptions} from '@ionic/angular';
import {EventEmitter, Injectable} from '@angular/core';
import {Subscription, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';

import {AppState} from '../../core.state';
import {AuthService} from './auth.service';
import {Store} from '@ngrx/store';

const SUCESSFULLY_UPDATE: AlertOptions = {
  header: 'Aggiornamento avvenuto con successo',
  message: 'i dati relativi al tuo profilo sono stati aggiornati',
  buttons: ['ok'],
};
const SUCESSFULLY_DELETE: AlertOptions = {
  header: 'Utente eliminato con successo',
  message: 'i dati relativi al tuo profilo sono stati eliminati',
  buttons: ['ok'],
};
const SUCESSFULLY_LOGIN: AlertOptions = {
  header: 'LOGIN',
  message: 'avvenuto con successo',
  buttons: ['ok'],
};
const SUCESSFULLY_REGISTRATION: AlertOptions = {
  header: 'REGISTRAZIONE',
  message: 'avvenuta con successo',
  buttons: ['ok'],
};
const SUCESSFULLY_RESEND: AlertOptions = {
  header: 'EMAIL SPEDITA',
  message: 'ti abbiamo inviato una nuova mail',
  buttons: ['ok'],
};
@Injectable()
export class AuthEffects {
  private _alertEVT: EventEmitter<AlertOptions> = new EventEmitter<AlertOptions>();
  private _alertSub: Subscription = Subscription.EMPTY;

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

  logout$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(_ =>
        this._authSvc.logout().pipe(
          map(user => AuthActions.loadSignInsSuccess({user})),
          catchError(error => {
            return of(AuthActions.loadSignInsFailure({error}));
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
          map(user => {
            this._alertEVT.emit(SUCESSFULLY_LOGIN);
            return AuthActions.loadSignInsSuccess({user});
          }),
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
          map(user => {
            this._alertEVT.emit(SUCESSFULLY_REGISTRATION);
            return AuthActions.loadSignUpsSuccess({user});
          }),
          catchError(error => {
            return of(AuthActions.loadSignUpsFailure({error}));
          }),
        ),
      ),
    );
  });

  updateUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.UpdateUser),
      switchMap(action =>
        this._authSvc.update(action.updates).pipe(
          map(user => {
            this._alertEVT.emit(SUCESSFULLY_UPDATE);
            return AuthActions.UpdateUserSuccess({user});
          }),
          catchError(error => {
            return of(AuthActions.UpdateUserFailure({error}));
          }),
        ),
      ),
    );
  });

  deleteUser$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.deleteUser),
      switchMap(action =>
        this._authSvc.delete().pipe(
          map(user => {
            this._alertEVT.emit(SUCESSFULLY_DELETE);
            return AuthActions.UpdateUserSuccess({user});
          }),
          catchError(error => {
            return of(AuthActions.UpdateUserFailure({error}));
          }),
        ),
      ),
    );
  });

  resendEmail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.resendEmail),
      switchMap(action =>
        this._authSvc.resendEmail().pipe(
          map(res => {
            this._alertEVT.emit(SUCESSFULLY_RESEND);
            return AuthActions.resendEmailSuccess({res});
          }),
          catchError(error => {
            return of(AuthActions.resendEmailFailure({error}));
          }),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private _authSvc: AuthService,
    private _alertCtrl: AlertController,
    private _store: Store<AppState>,
  ) {
    this._alertSub = this._alertEVT
      .pipe(
        switchMap(opt => this._alertCtrl.create(opt)),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(_ => {
        this._store.dispatch(AuthActions.loadAuths());
      });
  }
}

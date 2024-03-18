import {TranslateService} from '@ngx-translate/core';
import * as AuthActions from './auth.actions';

import {EventEmitter, Injectable} from '@angular/core';
import {AlertController, AlertOptions, NavController} from '@ionic/angular';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Subscription, of} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';

import {Store} from '@ngrx/store';
import {AppState} from '../../core.state';
import {AuthService} from './auth.service';
import {BroadcastNotificationService} from '../../../shared/services/broadcast-notification.service';

const SUCESSFULLY_UPDATE: AlertOptions = {
  cssClass: 'pap-alert',
  header: 'Aggiornamento avvenuto con successo',
  message: 'i dati relativi al tuo profilo sono stati aggiornati',
  buttons: [
    {
      text: 'ok',
      role: 'ok',
    },
  ],
};
const SUCESSFULLY_DELETE: AlertOptions = {
  cssClass: 'pap-alert',
  header: 'Utente eliminato con successo',
  message: 'i dati relativi al tuo profilo sono stati eliminati',
  buttons: [
    {
      text: 'ok',
      role: 'ok',
    },
  ],
};
const SUCESSFULLY_LOGIN: AlertOptions = {
  cssClass: 'pap-alert',
  header: 'LOGIN',
  message: 'Log in effettuato',
  buttons: [
    {
      text: 'ok',
      role: 'ok',
    },
  ],
};
const SUCESSFULLY_REGISTRATION: AlertOptions = {
  cssClass: 'pap-alert',
  header: 'REGISTRAZIONE',
  message: 'per confermare la registrazione clicca sul link ricevuto via mail',
  buttons: [
    {
      text: 'ok',
      role: 'ok',
    },
  ],
};
const SUCESSFULLY_RESEND: AlertOptions = {
  cssClass: 'pap-alert',
  header: 'EMAIL SPEDITA',
  message: 'ti abbiamo inviato una nuova mail',
  buttons: [
    {
      text: 'ok',
      role: 'ok',
    },
  ],
};
@Injectable()
export class AuthEffects {
  private _alertEVT: EventEmitter<AlertOptions> = new EventEmitter<AlertOptions>();
  private _alertSub: Subscription = Subscription.EMPTY;

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
            return of(AuthActions.UpdateUserFailure({error: this._generateErrorMsg(error)}));
          }),
        ),
      ),
    );
  });
  loadAuths$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadAuths),
      switchMap(_ =>
        this._authSvc.getUser().pipe(
          map(user => AuthActions.loadAuthsSuccess({user})),
          catchError(error => {
            return of(AuthActions.loadAuthsFailure({error: this._generateErrorMsg(error)}));
          }),
        ),
      ),
    );
  });
  loadSignin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadSignIns),
      switchMap(action =>
        this._authSvc.login(action.credential).pipe(
          map(user => {
            return AuthActions.loadSignInsSuccess({user});
          }),
          tap(() => this._broadcastNotificationSvc.getFcmToken()),
          catchError(error => {
            return of(AuthActions.loadSignInsFailure({error: this._generateErrorMsg(error)}));
          }),
        ),
      ),
    );
  });
  loadSignup$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.loadSignUps),
      switchMap(action =>
        this._authSvc.register(action.data).pipe(
          map(user => {
            this._alertEVT.emit(SUCESSFULLY_REGISTRATION);
            return AuthActions.loadSignUpsSuccess({user});
          }),
          catchError(error => {
            return of(AuthActions.loadSignUpsFailure({error: this._generateErrorMsg(error)}));
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
            return of(AuthActions.loadSignInsFailure({error: this._generateErrorMsg(error)}));
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
            return of(AuthActions.resendEmailFailure({error: this._generateErrorMsg(error)}));
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
          map((res: any) => {
            if (res.message != 'phone_number: changed successfully.') {
              this._alertEVT.emit(SUCESSFULLY_UPDATE);
            }
            return AuthActions.UpdateUserSuccess({user: res});
          }),
          catchError(error => {
            return of(AuthActions.UpdateUserFailure({error: this._generateErrorMsg(error)}));
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
    private _translateSvc: TranslateService,
    private _broadcastNotificationSvc: BroadcastNotificationService,
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

  private _generateErrorMsg(error: any): string {
    let res = '';
    if (error != null && error.error != null && error.error.message != null) {
      res = this._translateSvc.instant(error.error.message);
    }
    return res;
  }
}

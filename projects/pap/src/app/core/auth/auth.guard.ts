import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AlertController, AlertOptions, NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, delay, map, switchMap, tap} from 'rxjs/operators';
import {AppState} from '../core.state';
import {loadAuths, resendEmail} from './state/auth.actions';
import {isVerified, user} from './state/auth.selectors';

const NO_LOGGED: AlertOptions = {
  header: 'Non sei loggato',
  message: `Puoi accedere a questa pagina dopo aver effettuato il login o la registrazione`,
  cssClass: 'pap-alert-login',
  buttons: [
    {
      text: 'accedi',
      role: 'sign-in',
    },
    {
      text: 'registrati',
      role: 'sign-up',
    },
    {
      text: 'password dimenticata?',
      role: 'forgot-password',
    },
    {
      text: 'X',
      role: 'cancel',
    },
  ],
};

const NO_VERIFIED: AlertOptions = {
  cssClass: 'pap-alert',
  header: 'Email non verificata',
  message: 'devi ancora accettare la mail che ti abbiamo inviato',
  buttons: [
    {
      text: 'rispedisci email',
      role: 'resend',
    },
    {
      text: 'ok',
      role: 'ok',
      cssClass: 'pap-alert-btn-ok',
    },
  ],
};
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, OnDestroy {
  private _alertEVT: EventEmitter<AlertOptions> = new EventEmitter<AlertOptions>();
  private _alertSub: Subscription = Subscription.EMPTY;

  constructor(
    private _store: Store<AppState>,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
  ) {
    this._alertSub = this._alertEVT
      .pipe(
        switchMap(opt => this._alertCtrl.create(opt)),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(res => {
        if (res && res.role) {
          if (res.role === 'forgot-password') {
            const url = `${env.api}/password/reset`;
            window.open(url, '_system');
          } else if (res.role === 'resend') {
            this._store.dispatch(resendEmail());
          } else {
            this._navCtrl.navigateForward(res.role);
          }
        }
      });
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const usr$ = this._store.pipe(delay(300), select(user));
    const isVerified$ = this._store.pipe(select(isVerified));
    return isVerified$.pipe(
      tap(isV => {
        if (isV === false) {
          this._store.dispatch(loadAuths());
        }
      }),
      debounceTime(500),
      switchMap(isV => usr$),
      map(user => {
        const isL = user != null;
        const isV = user?.email_verified_at != null;
        if (!isL) {
          this._alertEVT.emit(NO_LOGGED);
        } else if (!isV) {
          this._alertEVT.emit(NO_VERIFIED);
        }

        return isL && isV;
      }),
    );
  }

  ngOnDestroy(): void {
    this._alertSub.unsubscribe();
  }
}

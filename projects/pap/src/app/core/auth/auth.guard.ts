import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AlertController, AlertOptions, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {map, Observable, Subscription, switchMap, tap, zip} from 'rxjs';
import {AppState} from '../core.state';
import {isLogged, isVerified} from './state/auth.selectors';

const NO_LOGGED: AlertOptions = {
  header: 'Non sei loggato',
  message: 'solo se loggato puoi accedere a questa pagina',
  buttons: [
    {
      text: 'login',
      role: 'sign-in',
    },
    {
      text: 'registrati',
      role: 'sign-up',
    },
    'annulla',
  ],
};

const NO_VERIFIED: AlertOptions = {
  header: 'Email non verificata',
  message: 'devi ancora accettare la mail che ti abbiamo inviato',
  buttons: ['ok'],
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
          this._navCtrl.navigateForward(res.role);
        }
      });
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLogged$ = this._store.pipe(select(isLogged));
    const isVerified$ = this._store.pipe(select(isVerified));
    return zip([isLogged$, isVerified$]).pipe(
      map(([isL, isV]) => {
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

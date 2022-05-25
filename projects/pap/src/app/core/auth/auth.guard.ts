import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AlertController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {Observable, switchMap, tap} from 'rxjs';
import {AppState} from '../core.state';
import {isLogged} from './state/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _alerEVT: EventEmitter<void> = new EventEmitter<void>();
  constructor(
    private _store: Store<AppState>,
    private _alertCtrl: AlertController,
    private _navCtrl: NavController,
  ) {
    this._alerEVT
      .pipe(
        switchMap(_ =>
          this._alertCtrl.create({
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
          }),
        ),
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
    return this._store.pipe(
      select(isLogged),
      tap(isLogged => {
        if (!isLogged) {
          this._alerEVT.emit();
        }
      }),
    );
  }
}

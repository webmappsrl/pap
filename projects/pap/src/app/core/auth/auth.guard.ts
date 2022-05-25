import {EventEmitter, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {from, Observable, switchMap, tap} from 'rxjs';
import {AppState} from '../core.state';
import {isLogged} from './state/auth.selectors';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private _alerEVT: EventEmitter<void> = new EventEmitter<void>();
  constructor(private _store: Store<AppState>, private _alertCtrl: AlertController) {
    this._alerEVT
      .pipe(
        switchMap(_ =>
          this._alertCtrl.create({
            header: 'Non sei loggato',
            message: 'solo se loggato puoi accedere a questa pagina',
            buttons: [
              {
                text: 'login',
                role: 'login',
              },
              {
                text: 'registrati',
                role: 'registrati',
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
        console.log(res);
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

import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {loadAuths} from './core/auth/state/auth.actions';
import {AppState} from './core/core.state';
import {loadCalendars} from './features/calendar/state/calendar.actions';
import {loadTrashBooks} from './features/trash-book/state/trash-book.actions';
import {BroadcastNotificationService} from './shared/services/broadcast-notification.service';
import {LocalNotificationService} from './shared/services/local-notification.service';
import {loadConfiniZone} from './shared/map/state/map.actions';
import {Observable} from 'rxjs';
import {noAddress} from './core/auth/state/auth.selectors';
import {filter, skip, switchMap, take} from 'rxjs/operators';
import {AlertController, NavController} from '@ionic/angular';
import {NavigationOptions} from '@ionic/angular/providers/nav-controller';

@Component({
  selector: 'pap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  noAddress$: Observable<boolean> = this._store.select(noAddress);

  constructor(
    private _store: Store<AppState>,
    _localNotificationSvc: LocalNotificationService,
    _broadcastNotificationSvc: BroadcastNotificationService,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
  ) {
    this._store.dispatch(loadAuths());
    this._store.dispatch(loadTrashBooks());
    this._store.dispatch(loadCalendars());
    this._store.dispatch(loadConfiniZone());
    this.noAddress$
      .pipe(
        skip(1),
        take(1),
        filter(f => f),
        switchMap(_ =>
          this._alertCtrl.create({
            header: 'Non hai un indirizzo valido',
            message: `Per usurfruire di tutte le funzionalita della app devi inserire un indirizzo`,
            buttons: [
              {
                text: 'ok',
                role: 'ok',
              },
            ],
          }),
        ),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(_ => {
        const opt: NavigationOptions = {};
        this._navCtrl.navigateForward('settings/address');
      });
  }
}

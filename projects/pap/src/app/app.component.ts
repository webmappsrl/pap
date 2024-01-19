import {Component} from '@angular/core';
import {AlertController, AlertOptions, ModalController, NavController} from '@ionic/angular';
import {NavigationOptions} from '@ionic/angular/providers/nav-controller';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, skip, switchMap, take} from 'rxjs/operators';
import {loadAuths} from './core/auth/state/auth.actions';
import {noAddress, noHouseNumber} from './core/auth/state/auth.selectors';
import {AppState} from './core/core.state';
import {loadCalendars} from './features/calendar/state/calendar.actions';
import {loadTrashBooks} from './features/trash-book/state/trash-book.actions';
import {loadConfiniZone} from './shared/map/state/map.actions';
import {BroadcastNotificationService} from './shared/services/broadcast-notification.service';
import {LocalNotificationService} from './shared/services/local-notification.service';
import {Address} from './core/auth/auth.model';
import {MissedHouseNumberModal} from './shared/missed-house.number-modal/missed-house-number.modal';

@Component({
  selector: 'pap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  noAddress$: Observable<boolean> = this._store.select(noAddress);
  noHouseNumber$: Observable<Address[] | undefined> = this._store.select(noHouseNumber);

  constructor(
    private _store: Store<AppState>,
    _localNotificationSvc: LocalNotificationService,
    _broadcastNotificationSvc: BroadcastNotificationService,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
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
            cssClass: 'pap-alert',
            header: 'Non hai un indirizzo valido',
            message: `Per usurfruire di tutte le funzionalita della app devi inserire un indirizzo`,
            buttons: [
              {
                text: 'ok',
                role: 'ok',
                cssClass: 'pap-alert-btn-ok',
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
    this.noHouseNumber$
      .pipe(
        filter(a => a != null),
        take(1),
        switchMap(addresses =>
          this._modalCtrl.create({
            component: MissedHouseNumberModal,
            componentProps: {addresses},
          }),
        ),
        switchMap(modal => {
          modal.present();
          return modal.onWillDismiss();
        }),
        switchMap(res => {
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
          return this._alertCtrl.create(SUCESSFULLY_UPDATE);
        }),
      )
      .subscribe(async alert => {
        (await alert).present();
      });
  }
}

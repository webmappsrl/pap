import {Component} from '@angular/core';
import {AlertController, AlertOptions, ModalController, NavController} from '@ionic/angular';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import {filter, skip, switchMap, take} from 'rxjs/operators';
import {loadAuths} from './core/auth/state/auth.actions';
import {
  error,
  isLogged,
  noAddress,
  noHouseNumber,
  userRoles,
} from './core/auth/state/auth.selectors';
import {AppState} from './core/core.state';
import {loadCalendars} from './features/calendar/state/calendar.actions';
import {loadTrashBooks} from './features/trash-book/state/trash-book.actions';
import {loadConfiniZone} from './shared/map/state/map.actions';
import {BroadcastNotificationService} from './shared/services/broadcast-notification.service';
import {LocalNotificationService} from './shared/services/local-notification.service';
import {Address} from './core/auth/auth.model';
import {App} from '@capacitor/app';
import {MissedHouseNumberModal} from './shared/missed-house.number-modal/missed-house-number.modal';
import {TranslateService} from '@ngx-translate/core';
import {IT} from '../assets/i18n/it';
import {yHomes} from './features/home/state/home.actions';

@Component({
  selector: 'pap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  authError$ = this._store.pipe(select(error));
  isLogged$ = this._store.pipe(select(isLogged));
  noAddress$: Observable<boolean> = this._store.select(noAddress);
  noHouseNumber$: Observable<Address[] | undefined> = this._store.select(noHouseNumber);
  userRoles$ = this._store.pipe(select(userRoles));

  constructor(
    private _store: Store<AppState>,
    private _localNotificationSvc: LocalNotificationService,
    _broadcastNotificationSvc: BroadcastNotificationService,
    private _navCtrl: NavController,
    private _alertCtrl: AlertController,
    private _modalCtrl: ModalController,
    private _translateSvc: TranslateService,
  ) {
    this._translateSvc.setTranslation('it', IT);
    this._store.dispatch(loadAuths());
    this._store.dispatch(loadTrashBooks());
    this.isLogged$
      .pipe(
        filter(l => l),
        take(1),
      )
      .subscribe(async () => {
        this._store.dispatch(loadCalendars());
        this._store.dispatch(loadConfiniZone());
        this._store.dispatch(yHomes());
        this._localNotificationSvc.scheduleNotifications();
        App.addListener('resume', () => {
          this._localNotificationSvc.scheduleNotifications();
        });
      });
    this.authError$
      .pipe(
        filter(f => f != null && f != 'Unauthenticated.'),
        switchMap(err => {
          const opts = {
            cssClass: 'pap-alert',
            header: 'Errore',
            message: err as string,
            buttons: [
              {
                text: 'ok',
                role: 'ok',
                cssClass: 'pap-alert-btn-ok',
              },
            ],
          };
          if (err === 'La mail è gia utilizzata si prega di recuperare la password.') {
            opts.buttons = [
              {
                text: 'recupera password',
                role: 'forgot-password',
              },
              {
                text: 'X',
                role: 'cancel',
              },
            ] as any;
          }
          return this._alertCtrl.create(opts);
        }),
        switchMap(alert => {
          alert.present();
          return alert.onWillDismiss();
        }),
      )
      .subscribe(res => {
        if (res && res.role) {
          if (res.role === 'forgot-password') {
            const url = `${env.api.replace('/api/v1', '')}/password/reset`;
            window.open(url, '_system');
          }
        }
      });
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

    this.userRoles$.subscribe(roles => {
      if (roles.some(r => r === 'dusty_man')) {
        this._navCtrl.navigateRoot('/dusty-man-reports');
      } else {
        this._navCtrl.navigateRoot('/home');
      }
    });
  }
}

import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {DeliveredNotifications, PushNotifications} from '@capacitor/push-notifications';
import {Store, select} from '@ngrx/store';
import {filter, map, take} from 'rxjs/operators';
import {isLogged, userRoles} from '../../core/auth/state/auth.selectors';
import {AuthService} from '../../core/auth/state/auth.service';
import {AppState} from '../../core/core.state';
import {Router} from '@angular/router';
import {
  selectTicketById,
  loadTickets,
} from '../../features/dusty-man-reports/state/reports.actions';
import {selectReports} from '../../features/dusty-man-reports/state/reports.selectors';
import {
  getDeliveredNotification,
  loadPushNotification,
} from '../../features/push-notification/state/push-notification.actions';
import {Observable, from} from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BroadcastNotificationService {
  isLogged$ = this._store.pipe(select(isLogged));
  selectReports$ = this._store.pipe(select(selectReports));
  userRoles$ = this._store.pipe(select(userRoles));

  constructor(
    private _store: Store<AppState>,
    private _authSvc: AuthService,
    private _router: Router,
  ) {
    if (Capacitor.getPlatform() !== 'web') {
      this.isLogged$
        .pipe(
          filter(l => l),
          take(1),
        )
        .subscribe(async () => {
          await this._registerNotifications();
          await PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push notification received: ', JSON.stringify(notification));
            this._store.dispatch(loadPushNotification());
            this._store.dispatch(getDeliveredNotification());
            this._store.dispatch(loadTickets());
          });

          await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log(
              'Push notification action performed',
              notification.actionId,
              notification.inputValue,
            );
            console.log('Push notification action performed', JSON.stringify(notification));
            const jsonDataString = notification.notification.data['gcm.notification.data'];
            if (!jsonDataString) {
              this._store.dispatch(loadPushNotification());
              this._router.navigate(['/push-notification']);
            } else {
              const jsonData = JSON.parse(jsonDataString);
              const ticketId = jsonData.ticket_id ?? null;
              this.userRoles$.pipe(take(1)).subscribe(roles => {
                if (roles.includes('dusty_man')) {
                  this._store.dispatch(loadTickets());
                  setTimeout(() => {
                    this.selectReports$.pipe(take(1)).subscribe(d => {
                      this._store.dispatch(selectTicketById({id: ticketId}));
                      this._router.navigate(['/dusty-man-reports', ticketId]);
                    });
                  }, 1500);
                }
              });
            }
            this._store.dispatch(getDeliveredNotification());
          });
          await PushNotifications.addListener('registration', token => {
            console.info('Registration token: ', token.value);
            this._authSvc.update({fcm_token: token.value}).pipe(take(1)).subscribe();
          });
          await PushNotifications.addListener('registrationError', err => {
            console.error('Registration error: ', err.error);
          });
        });
    }
  }

  getDeliveredNotifications(): Observable<DeliveredNotifications> {
    return from(PushNotifications.getDeliveredNotifications()).pipe(
      map((listNotifications: DeliveredNotifications) => {
        console.log('service getDeliveredNotifications', listNotifications);
        return listNotifications;
      }),
    );
  }

  async getFcmToken(): Promise<void> {
    await PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
      this._authSvc.update({fcm_token: token.value}).pipe(take(1)).subscribe();
    });
  }

  removeAllDeliveredNotifications(): Observable<void> {
    return from(PushNotifications.removeAllDeliveredNotifications());
  }

  private async _registerNotifications(): Promise<void> {
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    return PushNotifications.register();
  }
}

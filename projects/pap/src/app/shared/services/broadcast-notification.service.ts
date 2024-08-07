import {Injectable, NgZone} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {DeliveredNotifications, PushNotifications} from '@capacitor/push-notifications';
import {Store, select} from '@ngrx/store';
import {filter, map, take} from 'rxjs/operators';
import {isLogged, userRoles} from '../../core/auth/state/auth.selectors';
import {AuthService} from '../../core/auth/state/auth.service';
import {AppState} from '../../core/core.state';
import {Router} from '@angular/router';
import {
  getDeliveredNotification,
  loadPushNotification,
} from '../../features/push-notification/state/push-notification.actions';
import {Observable, from} from 'rxjs';
import {selectReports} from '../../features/reports/state/reports.selectors';
import {loadTickets, selectTicketById} from '../../features/reports/state/reports.actions';
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
    private _ngZone: NgZone,
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
            console.log('in pushNotificationActionPerformed');
            console.log('Push notification action performed', JSON.stringify(notification));
            const data = notification.notification.data;
            switch (data.page_on_click) {
              case '/push-notification':
                this._store.dispatch(loadPushNotification());
                break;
              case '/dusty-man-reports':
              case '/reports':
                this._navigateToReportsPage(data.page_on_click, data.ticket_id);
                break;
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

  private _navigateToReportsPage(path: string, ticketId: number | null): void {
    console.log('in _navigateToReportsPage');
    this._store.dispatch(loadTickets());
    this.selectReports$
      .pipe(
        filter(r => !!r && r.length > 0),
        take(1),
      )
      .subscribe(d => {
        this._store.dispatch(selectTicketById({id: ticketId!}));
        this._ngZone.run(() => {
          this._router.navigate([path, ticketId ?? null]);
        });
      });
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

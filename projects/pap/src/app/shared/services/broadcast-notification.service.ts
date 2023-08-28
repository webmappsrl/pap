import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {PushNotifications} from '@capacitor/push-notifications';
import {Store, select} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {isLogged} from '../../core/auth/state/auth.selectors';
import {filter, take} from 'rxjs/operators';
import {AuthService} from '../../core/auth/state/auth.service';
@Injectable({
  providedIn: 'root',
})
export class BroadcastNotificationService {
  isLogged$ = this._store.pipe(select(isLogged));

  constructor(private _store: Store<AppState>, private _authSvc: AuthService) {
    if (Capacitor.getPlatform() !== 'web') {
      this.isLogged$
        .pipe(
          filter(l => l),
          take(1),
        )
        .subscribe(async () => {
          await this._registerNotifications();
          await PushNotifications.addListener('pushNotificationReceived', notification => {
            console.log('Push notification received: ', notification);
            alert('Push received: ' + JSON.stringify(notification));
          });

          await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
            console.log(
              'Push notification action performed',
              notification.actionId,
              notification.inputValue,
            );
          });
          await PushNotifications.addListener('registration', token => {
            console.info('Registration token: ', token.value);
            this._authSvc.update({fcm_token: token.value}).pipe(take(1)).subscribe();
          });
          await PushNotifications.addListener('registrationError', err => {
            console.error('Registration error: ', err.error);
          });
          this._getDeliveredNotifications();
        });
    }
  }

  private async _getDeliveredNotifications(): Promise<void> {
    try {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
    } catch (e) {
      alert('Error on registration: ' + JSON.stringify(e));
    }
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

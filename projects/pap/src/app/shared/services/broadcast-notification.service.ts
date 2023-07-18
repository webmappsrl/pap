import {Injectable} from '@angular/core';
import {Capacitor} from '@capacitor/core';
import {PushNotifications} from '@capacitor/push-notifications';
@Injectable({
  providedIn: 'root',
})
export class BroadcastNotificationService {
  constructor() {
    if (Capacitor.getPlatform() !== 'web') {
      this._registerNotifications();
      setTimeout(async () => {
        await PushNotifications.addListener('registration', token => {
          console.info('Registration token: ', token.value);
          alert('Push registration success, token: ' + token.value);
        });

        await PushNotifications.addListener('registrationError', err => {
          console.error('Registration error: ', err.error);
          alert('Error on registration: ' + JSON.stringify(err));
        });

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
          alert('Push action performed: ' + JSON.stringify(notification));
        });
        this._getDeliveredNotifications();
      }, 500);
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
    alert('_registerNotifications');
    let permStatus = await PushNotifications.checkPermissions();

    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      throw new Error('User denied permissions!');
    }

    await PushNotifications.register();
  }
}

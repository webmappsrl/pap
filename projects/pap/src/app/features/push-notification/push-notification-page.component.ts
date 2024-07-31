import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable} from 'rxjs';
import {PushNotification} from './push-notification.model';
import {Store} from '@ngrx/store';
import {pushNotifications} from './state/push-notification.selectors';
import {filter, map, take} from 'rxjs/operators';
import {removeAllDeliveredNotifications} from './state/push-notification.actions';

@Component({
  selector: 'pap-push-notification-page',
  templateUrl: './push-notification-page.component.html',
  styleUrls: ['./push-notification-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PushNotificationsPageComponent implements OnInit {
  firstNotificationId$: Observable<number>;
  pushNotifications$: Observable<PushNotification[] | undefined> =
    this._store.select(pushNotifications);

  constructor(private _store: Store) {}

  ngOnInit(): void {
    this._store.dispatch(removeAllDeliveredNotifications());
    this.firstNotificationId$ = this.pushNotifications$.pipe(
      filter(notifications => !!notifications && notifications.length > 0),
      take(1),
      map(notifications => notifications![0].id),
    );
  }
}

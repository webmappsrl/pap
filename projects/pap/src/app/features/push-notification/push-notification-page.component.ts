import {ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {PushNotification} from './push-notification.model';
import {Store} from '@ngrx/store';
import {firstNotificationId, pushNotifications} from './state/push-notification.selectors';
import {
  loadPushNotification,
  removeAllDeliveredNotifications,
} from './state/push-notification.actions';

@Component({
  selector: 'pap-push-notification-page',
  templateUrl: './push-notification-page.component.html',
  styleUrls: ['./push-notification-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PushNotificationsPageComponent implements OnInit {
  private _firstNotificationIdSub: Subscription = Subscription.EMPTY;
  private _pushNotificationsSub: Subscription = Subscription.EMPTY;

  firstNotificationId$: Observable<number | undefined> = this._store.select(firstNotificationId);
  pushNotifications$: Observable<PushNotification[] | undefined> =
    this._store.select(pushNotifications);

  constructor(
    private _store: Store,
    private _cdr: ChangeDetectorRef,
    private _ngZone: NgZone,
  ) {}

  ngOnDestroy(): void {
    this._pushNotificationsSub.unsubscribe();
    this._firstNotificationIdSub.unsubscribe();
  }

  ngOnInit(): void {
    this._store.dispatch(removeAllDeliveredNotifications());
    this._store.dispatch(loadPushNotification());
    this._pushNotificationsSub = this.pushNotifications$.subscribe(() =>
      this._ngZone.run(() => this._cdr.detectChanges()),
    );
    this._firstNotificationIdSub = this.firstNotificationId$.subscribe(() =>
      this._ngZone.run(() => this._cdr.detectChanges()),
    );
  }
}

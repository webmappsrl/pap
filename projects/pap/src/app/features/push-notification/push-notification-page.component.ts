import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { PushNotification } from "./push-notification.model";
import { Store } from "@ngrx/store";
import { pushNotifications } from "./state/push-notification.selectors";
import { take } from "rxjs/operators";
import { removeAllDeliveredNotifications } from "./state/push-notification.actions";

@Component({
  selector: 'pap-push-notification-page',
  templateUrl: './push-notification-page.component.html',
  styleUrls: ['./push-notification-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PushNotificationsPageComponent implements OnInit{
  firstNotificationId$: BehaviorSubject<number | undefined> = new BehaviorSubject<number | undefined>(undefined);
  pushNotifications$: Observable<PushNotification[] | undefined> = this._store.select(pushNotifications);

  constructor(private _store: Store){}

  ngOnInit(): void {
    this._store.dispatch(removeAllDeliveredNotifications());
    this.pushNotifications$
    .pipe(take(1))
    .subscribe((notifications: PushNotification[] | undefined) => {
      if (notifications && notifications.length > 0) {
        this.firstNotificationId$.next(notifications[0].id);
      }
    });
  }
}

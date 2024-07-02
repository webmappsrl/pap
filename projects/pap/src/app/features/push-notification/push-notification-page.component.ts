import { Component, ViewEncapsulation } from "@angular/core";
import { Observable } from "rxjs";
import { PushNotification } from "./push-notification.model";
import { Store } from "@ngrx/store";
import { pushNotifications } from "./state/push-notification.selectors";

@Component({
  selector: 'pap-push-notification-page',
  templateUrl: './push-notification-page.component.html',
  styleUrls: ['./push-notification-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class PushNotificationsPageComponent {
  pushNotifications$: Observable<PushNotification[] | undefined> = this._store.select(pushNotifications);

  constructor(private _store: Store){}
}

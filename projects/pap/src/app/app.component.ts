import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {loadAuths} from './core/auth/state/auth.actions';
import {AppState} from './core/core.state';
import {loadTrashBooks} from './features/trash-book/state/trash-book.actions';
import {NotificationService} from './shared/services/notification.service';
import {loadCalendars} from './features/calendar/state/calendar.actions';

@Component({
  selector: 'pap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _store: Store<AppState>, _notificationSvc: NotificationService) {
    this._store.dispatch(loadAuths());
    this._store.dispatch(loadTrashBooks());
    this._store.dispatch(loadCalendars());
  }
}

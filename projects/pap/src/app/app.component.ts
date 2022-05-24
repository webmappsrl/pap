import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {loadAuths} from './core/auth/state/auth.actions';
import {AppState} from './core/core.state';

@Component({
  selector: 'pap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _store: Store<AppState>) {
    this._store.dispatch(loadAuths());
  }
}

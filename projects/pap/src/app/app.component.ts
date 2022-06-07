import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {loadAuths} from './core/auth/state/auth.actions';
import {AppState} from './core/core.state';
import {loadTrashBooks} from './features/trash-book/state/trash-book.actions';

@Component({
  selector: 'pap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private _store: Store<AppState>) {
    this._store.dispatch(loadAuths());
    this._store.dispatch(loadTrashBooks());
  }
}

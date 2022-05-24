import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from './core/core.state';
import {TrashBookError} from './features/trash-book/state/trash-book.selectors';

@Component({
  selector: 'pap-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  trashBookView$ = this._store.pipe(select(TrashBookError));
  constructor(private _store: Store<AppState>) {
    this.trashBookView$.subscribe(err => {
      if (err != '') {
        window.alert(JSON.stringify(err));
      }
    });
  }
}

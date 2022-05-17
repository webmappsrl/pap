import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {loadTrashBooks} from './state/trash-book.actions';
import {selectTrashBookState} from './state/trash-book.selectors';

@Component({
  selector: 'pap-trash-book',
  templateUrl: './trash-book.component.html',
  styleUrls: ['./trash-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookComponent {
  trashBookView$ = this._store.pipe(select(selectTrashBookState));
  constructor(private _store: Store<AppState>) {
    this._store.dispatch(loadTrashBooks());
  }
}

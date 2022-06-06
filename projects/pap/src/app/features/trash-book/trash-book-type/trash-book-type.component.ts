import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../core/core.state';
import {showButtons} from '../../../shared/header/state/header.actions';
import {selectedTrashBookType} from '../state/trash-book.selectors';

@Component({
  selector: 'pap-trash-book-type',
  templateUrl: './trash-book-type.component.html',
  styleUrls: ['./trash-book-type.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookTypeComponent {
  trashBookTypeView$ = this._store.pipe(select(selectedTrashBookType));

  constructor(private _store: Store<AppState>) {
    this._store.dispatch(showButtons({show: false}));
    this.trashBookTypeView$.subscribe(tb => {});
  }
}

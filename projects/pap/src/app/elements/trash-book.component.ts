import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {AppState} from '../core/core.state';
import {selectTrashBookState} from '../features/trash-book/state/trash-book.selectors';
import {showButtons} from '../shared/header/state/header.actions';
import {TrashBookRow} from '../features/trash-book/trash-book-model';
import {
  filterTrashBooks,
  setTrashBookDetail,
} from '../features/trash-book/state/trash-book.actions';

@Component({
  selector: 'pap-trash-book',
  templateUrl: './trash-book.component.html',
  styleUrls: ['./trash-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookComponent implements OnDestroy {
  trashBookView$ = this._store.pipe(select(selectTrashBookState));

  constructor(private _store: Store<AppState>, private _navCtrl: NavController) {
    this._store.dispatch(showButtons({show: false}));
  }

  buttonClick(item: TrashBookRow): void {
    this._store.dispatch(setTrashBookDetail({trashBookDetail: item}));
    this._navCtrl.navigateForward('trashbook/detail');
  }

  ngOnDestroy(): void {
    this._store.dispatch(filterTrashBooks({filter: ''}));
  }

  searchChange(event: Event): void {
    const ionChangeEvent = event as CustomEvent<{value: string}>;
    this._store.dispatch(filterTrashBooks({filter: ionChangeEvent.detail.value}));
  }
}

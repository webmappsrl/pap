import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {filterTrashBooks, setTrashBookDetail} from './state/trash-book.actions';
import {selectTrashBookState} from './state/trash-book.selectors';
import {TrashBookRow} from './trash-book-model';

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

  searchChange(event: any) {
    this._store.dispatch(filterTrashBooks({filter: event.detail.value}));
  }

  buttonClick(item: TrashBookRow) {
    this._store.dispatch(setTrashBookDetail({trashBookDetail: item}));
    this._navCtrl.navigateForward('trashbook/detail');
  }
  ngOnDestroy(): void {
    this._store.dispatch(filterTrashBooks({filter: ''}));
  }
}

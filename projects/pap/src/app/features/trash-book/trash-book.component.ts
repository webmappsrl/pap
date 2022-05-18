import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {setTrashBookDetails} from '../trash-book-details/state/trash-book-details.actions';
import {filterTrashBooks, loadTrashBooks} from './state/trash-book.actions';
import {selectTrashBookState} from './state/trash-book.selectors';
import {TrashBookRow} from './trash-book-model';

@Component({
  selector: 'pap-trash-book',
  templateUrl: './trash-book.component.html',
  styleUrls: ['./trash-book.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookComponent implements OnInit {
  trashBookView$ = this._store.pipe(select(selectTrashBookState));
  constructor(private _store: Store<AppState>, private _navCtrl: NavController) {
    this._store.dispatch(loadTrashBooks());
  }

  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
  }

  searchChange(event: any) {
    this._store.dispatch(filterTrashBooks({filter: event.detail.value}));
  }

  buttonClick(item: TrashBookRow) {
    this._store.dispatch(setTrashBookDetails({trashBookRow: item}));
    this._navCtrl.navigateForward('trashBookDetails');
  }
}

import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {AppState} from '../core/core.state';
import {selectTrashBookState} from '../features/trash-book/state/trash-book.selectors';
import {showButtons} from '../shared/header/state/header.actions';
import {TrashBookRow} from '../features/trash-book/trash-book-model';
import {
  filterTrashBooks,
  loadTrashBooks,
  setTrashBookDetail,
} from '../features/trash-book/state/trash-book.actions';
import {TrashBookDetailsComponent} from '../features/trash-book/trash-book-details/trash-book-details.component';

@Component({
  selector: 'pap-trash-book-element',
  templateUrl: './trash-book-element.component.html',
  styleUrls: ['./trash-book-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookElementComponent implements OnDestroy {
  trashBookView$ = this._store.select(selectTrashBookState);

  constructor(
    private _store: Store<AppState>,
    private _modalCtrl: ModalController,
  ) {
    this._store.dispatch(loadTrashBooks());
    this._store.dispatch(showButtons({show: false}));
  }

  buttonClick(item: TrashBookRow): void {
    this._store.dispatch(setTrashBookDetail({trashBookDetail: item}));
    this._modalCtrl
      .create({
        showBackdrop: true,
        backdropDismiss: true,
        component: TrashBookDetailsComponent,
        componentProps: {
          modal: true,
        },
      })
      .then(modal => modal.present());
  }

  ngOnDestroy(): void {
    this._store.dispatch(filterTrashBooks({filter: ''}));
  }

  searchChange(event: Event): void {
    const ionChangeEvent = event as CustomEvent<{value: string}>;
    this._store.dispatch(filterTrashBooks({filter: ionChangeEvent.detail.value}));
  }
}

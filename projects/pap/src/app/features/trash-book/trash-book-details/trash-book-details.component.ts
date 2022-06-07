import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../../core/core.state';
import {currentTrashBookType} from '../../../shared/form/state/form.actions';
import {showButtons} from '../../../shared/header/state/header.actions';
import {selectedTrashBookDetail} from '../state/trash-book.selectors';
import {TrashBookType} from '../trash-book-model';
import {TrashBookTypeComponent} from '../trash-book-type/trash-book-type.component';

@Component({
  selector: 'pap-trash-book-details',
  templateUrl: './trash-book-details.component.html',
  styleUrls: ['./trash-book-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookDetailsComponent {
  trashBookDetailsView$ = this._store.pipe(select(selectedTrashBookDetail));

  constructor(
    private _store: Store<AppState>,
    private _modalController: ModalController,
    private navController: NavController,
  ) {
    this._store.dispatch(showButtons({show: false}));
  }

  info(tbType: TrashBookType | undefined) {
    if (tbType) {
      const modal = this._modalController
        .create({
          component: TrashBookTypeComponent,
          showBackdrop: true,
          componentProps: {trashBookType: tbType},
        })
        .then(modal => modal.present());
    }
  }

  book(tbType: TrashBookType | undefined) {
    if (tbType) {
      this._store.dispatch(currentTrashBookType({currentTrashBookType: tbType}));
    }
    this.navController.navigateForward('ticket-reservation');
  }
}

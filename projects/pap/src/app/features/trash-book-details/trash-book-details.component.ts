import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModalController, NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {loadTrashBookDetailss} from './state/trash-book-details.actions';
import {selectTrashBookDetailsState} from './state/trash-book-details.selectors';
import {TrashBookTypeComponent} from './trash-book-type/trash-book-type.component';

@Component({
  selector: 'pap-trash-book-details',
  templateUrl: './trash-book-details.component.html',
  styleUrls: ['./trash-book-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TrashBookDetailsComponent implements OnInit {
  trashBookDetailsView$ = this._store.pipe(select(selectTrashBookDetailsState));

  constructor(private _store: Store<AppState>, private _modalController: ModalController) {
    this._store.dispatch(loadTrashBookDetailss());
  }
  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
  }

  info(type: any) {
    console.log('------- ~ TrashBookDetailsComponent ~ info ~ type', type);
    const modal = this._modalController
      .create({
        component: TrashBookTypeComponent,
      })
      .then(modal => modal.present());
  }
}

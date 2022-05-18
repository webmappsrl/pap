import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {showButtons} from '../../shared/header/state/header.actions';
import {loadTrashBookDetailss} from './state/trash-book-details.actions';
import {selectTrashBookDetailsState} from './state/trash-book-details.selectors';

@Component({
  selector: 'pap-trash-book-details',
  templateUrl: './trash-book-details.component.html',
  styleUrls: ['./trash-book-details.component.scss'],
})
export class TrashBookDetailsComponent implements OnInit {
  trashBookDetailsView$ = this._store.pipe(select(selectTrashBookDetailsState));

  constructor(private _store: Store<AppState>, private _navCtrl: NavController) {
    this._store.dispatch(loadTrashBookDetailss());
  }
  ngOnInit(): void {
    this._store.dispatch(showButtons({show: false}));
  }

  info(type: any) {
    console.log('------- ~ TrashBookDetailsComponent ~ info ~ type', type);
  }
}

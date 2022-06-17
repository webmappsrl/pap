import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../core/core.state';
import {setTrashBookType} from '../trash-book/state/trash-book.actions';
import {TrashBookType} from '../trash-book/trash-book-model';
import {TrashBookTypeComponent} from '../trash-book/trash-book-type/trash-book-type.component';
import {ReportsDetailComponent} from './reports-detail.component';
import {loadReportss} from './state/reports.actions';
import {Ticket} from './state/reports.effects';
import {selectReports} from './state/reports.selectors';

@Component({
  selector: 'pap-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportsComponent {
  reportsView$ = this._store.pipe(select(selectReports));

  constructor(private _store: Store<AppState>, private _modalCtrl: ModalController) {
    this._store.dispatch(loadReportss());
  }

  openDetail(report: Ticket) {
    this._modalCtrl
      .create({
        component: ReportsDetailComponent,
        showBackdrop: true,
        componentProps: {report},
      })
      .then(modal => modal.present());
  }

  openTrashTypeDetail(tbType: TrashBookType, event: Event) {
    event.stopPropagation();
    this._store.dispatch(setTrashBookType({trashBookType: tbType}));
    this._modalCtrl
      .create({
        component: TrashBookTypeComponent,
        showBackdrop: true,
        componentProps: {trashBookType: tbType},
      })
      .then(modal => modal.present());
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {skip} from 'rxjs/operators';
import {AppState} from '../../core/core.state';
import {setTrashBookType} from '../trash-book/state/trash-book.actions';
import {TrashBookType} from '../trash-book/trash-book-model';
import {TrashBookTypeComponent} from '../trash-book/trash-book-type/trash-book-type.component';
import {ReportsDetailComponent} from './reports-detail.component';
import {loadTickets} from './state/reports.actions';
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
  reportsView$ = this._store.pipe(select(selectReports), skip(1));

  constructor(
    private _store: Store<AppState>,
    private _modalCtrl: ModalController,
    private _cdr: ChangeDetectorRef,
  ) {}

  ionViewWillEnter(): void {
    this._store.dispatch(loadTickets());
    this._cdr.detectChanges();
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

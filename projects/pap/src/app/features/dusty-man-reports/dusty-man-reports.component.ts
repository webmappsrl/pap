import {ChangeDetectionStrategy, Component, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {map, startWith} from 'rxjs/operators';
import {AppState} from '../../core/core.state';
import {setTrashBookType} from '../trash-book/state/trash-book.actions';
import {TrashBookType} from '../trash-book/trash-book-model';
import {TrashBookTypeComponent} from '../trash-book/trash-book-type/trash-book-type.component';
import {loadTickets, selectTicketById} from './state/reports.actions';
import {Ticket} from './state/reports.effects';
import {selectReports} from './state/reports.selectors';
import {BehaviorSubject, Subscription, interval} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'pap-dusty-man-reports',
  templateUrl: './dusty-man-reports.component.html',
  styleUrls: ['./dusty-man-reports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DustyManReportsComponent implements OnDestroy {
  currentTime$ = interval(5000).pipe(
    startWith(new Date()),
    map(() => new Date()),
  );
  currentTimeSub$: Subscription = Subscription.EMPTY;
  reload$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  reportsView$ = this._store.pipe(select(selectReports));

  constructor(
    private _store: Store<AppState>,
    private _modalCtrl: ModalController,
    private _router: Router,
  ) {
    //TODO: non basta la loadTickets del broadcastservice quando l'array è vuoto non riconosce un nuovo elemento
    this.currentTimeSub$ = this.currentTime$.subscribe(_ => {
      this._store.dispatch(loadTickets());
    });
  }

  ionViewWillEnter(): void {
    this._store.dispatch(loadTickets());
  }

  ngOnDestroy(): void {
    this.currentTimeSub$.unsubscribe();
  }

  openDetail(report: Ticket) {
    this._store.dispatch(selectTicketById({id: report.id}));
    this._router.navigate(['/dusty-man-reports', report.id]);
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

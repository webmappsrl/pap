import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {format as fm, subDays} from 'date-fns';
import {Observable, combineLatest} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {AppState} from '../../core/core.state';
import {TicketFormConf} from '../../shared/models/form.model';
import {selectCompanyProperties, selectLoading} from '../../shared/form/state/company.selectors';
import {selectTicketFormConfByType} from '../../shared/form/state/form.selectors';
import {loadReportCalendars} from './state/report-calendar.actions';

@Component({
  selector: 'pap-report-ticket',
  templateUrl: './report-ticket.component.html',
  styleUrls: ['./report-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportTicketComponent {
  form$: Observable<TicketFormConf> = this._store.pipe(select(selectTicketFormConfByType('report')));

  constructor(
    private _navCtrl: NavController,
    private _store: Store<AppState>,
  ) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

  ionViewWillEnter(): void {
    const start_date = fm(subDays(new Date(), 15), 'd-M-yyyy');
    const stop_date = fm(new Date(), 'd-M-yyyy');
    combineLatest([
      this._store.pipe(select(selectCompanyProperties)),
      this._store.pipe(select(selectLoading)),
    ])
      .pipe(
        filter(([, loading]) => !loading),
        take(1),
      )
      .subscribe(([properties]) => {
        this._store.dispatch(
          loadReportCalendars({
            start_date,
            stop_date,
            exclude_in_progress: properties?.enableExludeInProgress ?? false,
          }),
        );
      });
  }
}

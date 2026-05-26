import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {format as fm, subDays} from 'date-fns';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {AppState} from '../../core/core.state';
import {TicketFormConf} from '../../shared/models/form.model';
import {selectCompanyProperties} from '../../shared/form/state/company.selectors';
import {selectTicketFormConfByType} from '../../shared/form/state/form.selectors';
import {loadCalendars} from '../calendar/state/calendar.actions';
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
    this._store
      .pipe(select(selectCompanyProperties), take(1))
      .subscribe(properties => {
        this._store.dispatch(
          loadCalendars({
            start_date,
            stop_date,
            exclude_in_progress: properties?.enableExludeInProgress ?? false,
        }));
      });
  }
}

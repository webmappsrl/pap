import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AppState} from '@capacitor/app';
import {NavController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {format as fm, subDays} from 'date-fns';
import {reportTicketForm, TicketFormConf} from '../../shared/models/form.model';
import {loadCalendars} from '../calendar/state/calendar.actions';
@Component({
  selector: 'pap-report-ticket',
  templateUrl: './report-ticket.component.html',
  styleUrls: ['./report-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportTicketComponent {
  form: TicketFormConf = reportTicketForm;

  constructor(
    private _navCtrl: NavController,
    private _store: Store<AppState>,
  ) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

  formFilled(event: any): void {
    this.form = event;
  }

  ionViewWillEnter(): void {
    const start_date = fm(subDays(new Date(), 15), 'd-M-yyyy');
    const stop_date = fm(new Date(), 'd-M-yyyy');
    this._store.dispatch(loadCalendars({start_date, stop_date}));
  }

  ionViewWillLeave(): void {
    this._store.dispatch(loadCalendars());
  }
}

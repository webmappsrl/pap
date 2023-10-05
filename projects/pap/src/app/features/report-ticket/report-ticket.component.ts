import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AppState} from '@capacitor/app';
import {NavController} from '@ionic/angular';
import {Store} from '@ngrx/store';
import {format as fm, subDays} from 'date-fns';
import {environment} from 'projects/pap/src/environments/environment';
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
  public form: TicketFormConf = reportTicketForm;

  constructor(private navController: NavController, private _store: Store<AppState>) {
    const stop_date = fm(new Date(), 'd-M-Y');
    const start_date = fm(subDays(new Date(), 14), 'd-M-Y');
    this._store.dispatch(loadCalendars({start_date, stop_date}));
  }

  exitPage() {
    this.navController.pop();
  }

  formFilled(event: any) {
    this.form = event;
  }

  ionViewWillLeave() {
    this._store.dispatch(loadCalendars());
  }
}

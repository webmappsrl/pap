import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {first} from 'rxjs/operators';
import {AuthService} from '../../core/auth/state/auth.service';
import {AppState} from '../../core/core.state';
import {ApiTicketType} from '../../shared/models/apimodels';
import {TicketFormConf, infoTicketForm} from '../../shared/models/form.model';
import {ReportService} from '../../shared/services/report.service';
import {loadInfoTickets, sendReportInfoTickets} from './state/info-ticket.actions';
import {selectInfoTicketState} from './state/info-ticket.selectors';

@Component({
  selector: 'pap-info-ticket',
  templateUrl: './info-ticket.component.html',
  styleUrls: ['./info-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InfoTicketComponent implements OnInit {
  end = false;
  formConf: TicketFormConf = infoTicketForm;
  infoTicketView$ = this._store.pipe(select(selectInfoTicketState));
  privacyCheck: boolean = false;

  constructor(
    private _navCtrl: NavController,
    private _authSvc: AuthService,
    private _store: Store<AppState>,
    private _reportSvc: ReportService,
  ) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

  formFilled(event: any): void {
    this.end = true;
  }

  ngOnInit(): void {
    this._store.dispatch(loadInfoTickets());
  }

  openForm(): void {
    this.end = !this.end;
  }

  saveData(): void {
    this._authSvc
      .getUser()
      .pipe(first())
      .subscribe(user => {
        let report = this._reportSvc.createReport(this.formConf, user, ApiTicketType.INFO);
        this._store.dispatch(sendReportInfoTickets({data: report}));
      });
  }
}

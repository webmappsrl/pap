import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {environment} from 'projects/pap/src/environments/environment';
import {first} from 'rxjs/operators';
import {AuthService} from '../../core/auth/state/auth.service';
import {AppState} from '../../core/core.state';
import {ApiTicketType} from '../../shared/models/apimodels';
import {TicketFormConf, infoTicketTypes} from '../../shared/models/form.model';
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
  public end = false;
  public formConf: TicketFormConf = infoTicketTypes;
  infoTicketView$ = this._store.pipe(select(selectInfoTicketState));
  public privacyCheck: boolean = false;

  constructor(
    private navController: NavController,
    private authSErvice: AuthService,
    private _store: Store<AppState>,
    private reportService: ReportService,
  ) {}

  exitPage() {
    this.navController.pop();
  }

  formFilled(event: any) {
    this.end = true;
  }

  ngOnInit(): void {
    this._store.dispatch(loadInfoTickets());
  }

  openForm() {
    this.end = !this.end;
  }

  saveData() {
    this.authSErvice
      .getUser()
      .pipe(first())
      .subscribe(user => {
        let report = this.reportService.createReport(this.formConf, user, ApiTicketType.INFO);
        this._store.dispatch(sendReportInfoTickets({data: report}));
      });
  }
}

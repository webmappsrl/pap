import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {first} from 'rxjs/operators';
import {AuthService} from '../../core/auth/state/auth.service';
import {AppState} from '../../core/core.state';
import {ApiTicketType} from '../../shared/models/apimodels';
import {TicketFormConf} from '../../shared/models/form.model';
import {ReportService} from '../../shared/services/report.service';
import {loadInfoTickets, sendReportInfoTickets} from './state/info-ticket.actions';
import {selectInfoTicketState} from './state/info-ticket.selectors';
import {environment} from 'projects/pap/src/environments/environment';

@Component({
  selector: 'pap-info-ticket',
  templateUrl: './info-ticket.component.html',
  styleUrls: ['./info-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InfoTicketComponent implements OnInit {
  public end = false;
  public formConf: TicketFormConf = {
    ticketType: 'info',
    cancel: 'Uscendo perderai tutti i dati inseriti. Sicuro di volerlo fare?',
    finalMessage:
      'La tua richiesta è stata inoltrata correttamente: verrai ricontattato quanto prima per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni. Puoi rivedere tutte le tue segnalazioni nella sezione "Le mie Segnalazioni"',
    translationsObj: {
      finalMessage: {
        companyName: 'APP.company',
      },
    },
    label: 'Richiesta informazioni',
    pages: 3,
    step: [
      {
        label: `Questo serivizio ti permette di richiedere informazioni direttamente a ${environment.config.name}. Al termine ti verrà assegnato un codice della richiesta e verrà inviata una email a ${environment.config.name}: verrai ricontattato appena possibile. Clicca sul bottone ' >          ' per iniziare.`,
        type: 'label',
        required: false,
        translationsObj: {
          label: {
            companyName: 'APP.company',
          },
        },
      },
      {
        label: `Scrivi qui le informazioni che vorresti richiedere a ${environment.config.name}`,
        type: 'note',
        required: true,
        value: '',
        recap: 'Richiesta',
        translationsObj: {
          label: {
            companyName: 'APP.company',
          },
        },
      },
      {
        label:
          "Per rendere l'operazione più rapida puoi decidere di lasciarci il tuo numero di telefono",
        type: 'phone',
        required: false,
        value: '',
        recap: 'Telefono',
      },
      {
        label: '',
        type: 'recap',
        required: false,
      },
    ],
  };
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

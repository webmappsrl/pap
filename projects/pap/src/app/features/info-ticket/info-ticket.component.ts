import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {select, Store} from '@ngrx/store';
import {first} from 'rxjs';
import {AuthService} from '../../core/auth/state/auth.service';
import {AppState} from '../../core/core.state';
import {selectInfoState} from '../info/state/info.selectors';
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
  infoTicketView$ = this._store.pipe(select(selectInfoTicketState));

  public pos = 0;
  public end = false;
  public privacyCheck: boolean = false;

  public form = {
    cancel: 'Uscendo perderai tutti i dati inseriti. Sicuro di volerlo fare?',
    finalMessage:
      'La tua richiesta è stata inoltrata correttamente: verrai ricontattato quanto prima per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni. Puoi rivedere tutte le tue segnalazioni nella sezione "Le mie Segnalazioni"',
    translationsObj: {
      finalMessage: {
        companyName: 'APP.company',
      },
    },
    pages: 3,
    step: [
      {
        label:
          "Questo serivizio ti permette di richiedere informazioni direttamente a {{companyName}}. Al termine ti verrà assegnato un codice della richiesta e verrà inviata una email a {{companyName}}: verrai ricontattato appena possibile. Clicca sul bottone ' >          ' per iniziare.",
        type: 'label',
        mandatory: false,
        translationsObj: {
          label: {
            companyName: 'APP.company',
          },
        },
      },
      {
        label: 'Scrivi qui le informazioni che vorresti richiedere a {{companyName}}',
        type: 'textarea',
        mandatory: true,
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
        type: 'tel',
        mandatory: false,
        value: '',
        recap: 'Telefono',
      },
    ],
  };

  constructor(
    private navController: NavController,
    private authSErvice: AuthService,
    private _store: Store<AppState>,
  ) {}

  ngOnInit(): void {
    this._store.dispatch(loadInfoTickets());
  }

  formFilled(event: any) {
    this.form = event;
    this.end = true;
  }

  openForm() {
    this.pos = 2;
    this.end = !this.end;
  }

  exitPage() {
    this.navController.pop();
  }

  saveData() {
    this.authSErvice
      .getUser()
      .pipe(first())
      .subscribe(user => {
        console.log('------- ~ InfoTicketComponent ~ saveData ~ user', user);

        let report = {
          email: user.email,
          name: user.name,
          // lastname: this.lastname,
          // address: this.address,
          // location: this.location,
          type: 'info',
          subtype: this.form.step[1].value,
          picture: '',
          note: '',
          tel: this.form.step[2].value,
        };
        this._store.dispatch(sendReportInfoTickets({data: report}));
      });
  }
}

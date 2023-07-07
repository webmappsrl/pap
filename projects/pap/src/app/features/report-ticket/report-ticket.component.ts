import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';

import {NavController} from '@ionic/angular';
import {TicketFormConf} from '../../shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

@Component({
  selector: 'pap-report-ticket',
  templateUrl: './report-ticket.component.html',
  styleUrls: ['./report-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ReportTicketComponent {
  public form: TicketFormConf = {
    ticketType: 'report',
    cancel: 'Sicuro di voler cancellare la prenotazione?',
    finalMessage: `La tua richiesta è stata inoltrata correttamente a ${environment.config.name}: verrai ricontattato quanto prima via email per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni con ${environment.config.name}. Puoi rivedere tutte le tue segnalazioni nella sezione “Le mie Segnalazioni”`,
    pages: 5,
    label: 'Segnalazione mancato ritiro',
    step: [
      {
        label: `Questo servizio ti permette di segnalare ad ${environment.config.name} un mancato ritiro del servizio di raccolta porta a porta. Al termine ti verrà assegnato un codice e verrà inviata una email a ${environment.config.name}: verrai ricontattato in caso di necessità. Clicca sul bottone “Procedi” per iniziare.`,
        type: 'label',
        required: false,
      },
      {
        label: 'Scegli il tipo di servizio che non ha funzionato:',
        type: 'trash_type_id',
        required: true,
        recap: 'Servizio',
      },
      {
        label: '',
        type: 'location',
        required: true,
        recap: 'Indirizzo',
      },
      {
        label: 'Puoi aggiungere una foto: ci aiuterà a capire meglio cosa è successo',
        type: 'image',
        required: false,
        recap: 'Immagine',
      },
      {
        label: 'Se lo ritieni opportuno puoi inserire delle note',
        type: 'note',
        required: false,
        recap: 'Note',
      },
    ],
  };

  constructor(private navController: NavController) {}

  formFilled(event: any) {
    this.form = event;
  }

  exitPage() {
    this.navController.pop();
  }
}

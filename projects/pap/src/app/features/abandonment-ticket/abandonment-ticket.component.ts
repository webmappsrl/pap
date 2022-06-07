import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketFormConf} from '../../shared/models/form.model';

@Component({
  selector: 'pap-abandonment-ticket',
  templateUrl: './abandonment-ticket.component.html',
  styleUrls: ['./abandonment-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AbandonmentTicketComponent {
  public form: TicketFormConf = {
    cancel: 'Sicuro di voler cancellare la prenotazione?',
    finalMessage:
      'La tua richiesta è stata inoltrata correttamente a ESA: verrai ricontattato quanto prima via email per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni con ESA. Puoi rivedere tutte le tue segnalazioni nella sezione “Le mie Segnalazioni”',
    pages: 5,
    ticketType: 'abandonment',
    step: [
      {
        label:
          'Questo serivizio ti permette di inviare una segnalazione di abbandono ad ESA. Al termine della segnalazione ti verrà assegnato un codice e verrà inviata una email a ESA. Clicca sul bottone “Procedi” per iniziare.',
        type: 'label',
        required: false,
      },
      {
        label: 'Scegli il tipo di abbandono:',
        type: 'select',
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
        label: 'Aggiungi una foto: ci aiuterà a capire la situazione',
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

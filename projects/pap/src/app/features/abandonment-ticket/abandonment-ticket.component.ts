import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketFormConf} from '../../shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

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
    finalMessage: `La tua richiesta è stata inoltrata correttamente a ${environment.config.name}: verrai ricontattato quanto prima via email per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni con ${environment.config.name}. Puoi rivedere tutte le tue segnalazioni nella sezione “Le mie Segnalazioni”`,
    pages: 5,
    ticketType: 'abandonment',
    label: 'Segnalazione di abbandono',
    step: [
      {
        label: `Questo serivizio ti permette di inviare una segnalazione di abbandono ad ${environment.config.name}. Al termine della segnalazione ti verrà assegnato un codice e verrà inviata una email a ${environment.config.name}. Clicca sul bottone “Procedi” per iniziare.`,
        type: 'label',
        required: false,
      },
      {
        label: 'Scegli il tipo di abbandono:',
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
      {
        label: '',
        type: 'recap',
        required: false,
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

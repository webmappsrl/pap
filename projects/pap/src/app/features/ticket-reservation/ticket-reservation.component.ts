import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketFormConf} from '../../shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

@Component({
  selector: 'pap-ticket-reservation',
  templateUrl: './ticket-reservation.component.html',
  styleUrls: ['./ticket-reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicketReservationComponent {
  public form: TicketFormConf = {
    ticketType: 'reservation',
    label: 'Prenotazione servizio',
    cancel: 'Sicuro di voler cancellare la prenotazione?',
    finalMessage: `La tua richiesta è stata inoltrata correttamente a ${environment.config.name}: verrai ricontattato quanto prima via email per eventuali dettagli. Puoi usare tale codice per eventuali successive comunicazioni con ${environment.config.name}. Puoi rivedere tutte le tue segnalazioni nella sezione “Le mie Segnalazioni”`,
    pages: 6,
    step: [
      {
        label: `Questo serivizio ti permette di inviare una richiesta di prenotazione di un servizio ${environment.config.name}. Al termine della segnalazione ti verrà assegnato un codice della segnalazione e verrà inviata una email a ${environment.config.name}: verrai ricontattato concordare i dettagli della prenotazione. Clicca sul bottone “Procedi” per iniziare.`,
        type: 'label',
        required: false,
      },
      {
        label: 'Scegli il tipo di servizio da prenotare:',
        type: 'trash_type_id',
        required: true,
        recap: 'Servizio',
      },
      {
        label: 'Seleziona il luogo:',
        type: 'location',
        required: true,
        recap: 'Indirizzo',
      },
      {
        label: 'Puoi aggiungere una foto: ci aiuterà a capire meglio la situazione',
        type: 'image',
        required: false,
        recap: 'Immagine',
      },
      {
        label: 'Se lo ritieni opportuno, puoi inserire delle note',
        type: 'note',
        required: false,
        recap: 'Note',
      },
      {
        label:
          "Per rendere l'operazione più rapida puoi decidere di lasciarci il tuo numero di telefono",
        type: 'phone',
        required: false,
        recap: 'Telefono',
      },
    ],
  };

  constructor(private navController: NavController) {}

  exitPage() {
    this.navController.pop();
  }

  formFilled(event: any) {
    this.form = event;
  }
}

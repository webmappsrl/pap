import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {environment} from 'projects/pap/src/environments/environment';
import {TicketFormConf, ticketReservationTypes} from '../../shared/models/form.model';

@Component({
  selector: 'pap-ticket-reservation',
  templateUrl: './ticket-reservation.component.html',
  styleUrls: ['./ticket-reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicketReservationComponent {
  public form: TicketFormConf = ticketReservationTypes;

  constructor(private navController: NavController) {}

  exitPage() {
    this.navController.pop();
  }

  formFilled(event: any) {
    this.form = event;
  }
}

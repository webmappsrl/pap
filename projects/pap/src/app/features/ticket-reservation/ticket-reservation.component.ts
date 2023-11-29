import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketFormConf, ticketReservationForm} from '../../shared/models/form.model';

@Component({
  selector: 'pap-ticket-reservation',
  templateUrl: './ticket-reservation.component.html',
  styleUrls: ['./ticket-reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicketReservationComponent {
  form: TicketFormConf = ticketReservationForm;

  constructor(private _navCtrl: NavController) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

  formFilled(event: any): void {
    this.form = event;
  }
}

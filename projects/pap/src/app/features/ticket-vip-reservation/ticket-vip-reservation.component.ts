import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {
  TicketFormConf,
  ticketReservationForm,
  ticketVipReservationForm,
} from '../../shared/models/form.model';

@Component({
  selector: 'pap-ticket-vip-reservation',
  templateUrl: './ticket-vip-reservation.component.html',
  styleUrls: ['./ticket-vip-reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicketVipReservationComponent {
  form: TicketFormConf = ticketVipReservationForm;

  constructor(private _navCtrl: NavController) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

  formFilled(event: any): void {
    this.form = event;
  }
}

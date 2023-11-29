import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketFormConf, abandonmentTicketForm} from '../../shared/models/form.model';

@Component({
  selector: 'pap-abandonment-ticket',
  templateUrl: './abandonment-ticket.component.html',
  styleUrls: ['./abandonment-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AbandonmentTicketComponent {
  form: TicketFormConf = abandonmentTicketForm;

  constructor(private _navCtrl: NavController) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

  formFilled(event: any): void {
    this.form = event;
  }
}

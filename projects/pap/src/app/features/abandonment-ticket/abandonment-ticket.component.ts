import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {TicketFormConf, abandonmentTicketTypes} from '../../shared/models/form.model';
import {environment} from 'projects/pap/src/environments/environment';

@Component({
  selector: 'pap-abandonment-ticket',
  templateUrl: './abandonment-ticket.component.html',
  styleUrls: ['./abandonment-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AbandonmentTicketComponent {
  public form: TicketFormConf = abandonmentTicketTypes;

  constructor(private navController: NavController) {}

  exitPage() {
    this.navController.pop();
  }

  formFilled(event: any) {
    this.form = event;
  }
}

import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../core/core.state';
import {TicketFormConf} from '../../shared/models/form.model';
import {selectTicketFormConfByType} from '../../shared/form/state/form.selectors';

@Component({
  selector: 'pap-abandonment-ticket',
  templateUrl: './abandonment-ticket.component.html',
  styleUrls: ['./abandonment-ticket.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AbandonmentTicketComponent {
  form$: Observable<TicketFormConf> = this._store.pipe(
    select(selectTicketFormConfByType('abandonment')),
  );

  constructor(
    private _navCtrl: NavController,
    private _store: Store<AppState>,
  ) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

}

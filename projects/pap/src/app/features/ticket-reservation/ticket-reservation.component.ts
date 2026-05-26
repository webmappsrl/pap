import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Store, select} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../../core/core.state';
import {TicketFormConf} from '../../shared/models/form.model';
import {selectTicketFormConfByType} from '../../shared/form/state/form.selectors';

@Component({
  selector: 'pap-ticket-reservation',
  templateUrl: './ticket-reservation.component.html',
  styleUrls: ['./ticket-reservation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TicketReservationComponent {
  form$: Observable<TicketFormConf> = this._store.pipe(
    select(selectTicketFormConfByType('reservation')),
  );

  constructor(
    private _navCtrl: NavController,
    private _store: Store<AppState>,
  ) {}

  exitPage(): void {
    this._navCtrl.pop();
  }

}

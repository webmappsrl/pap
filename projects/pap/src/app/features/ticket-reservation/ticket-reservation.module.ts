import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TicketReservationRoutingModule} from './ticket-reservation-routing.module';
import {TicketReservationComponent} from './ticket-reservation.component';
import {StoreModule} from '@ngrx/store';
import * as fromTicketReservation from './state/ticket-reservation.reducer';
import {EffectsModule} from '@ngrx/effects';
import {TicketReservationEffects} from './state/ticket-reservation.effects';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [TicketReservationComponent],
  imports: [
    CommonModule,
    SharedModule,
    TicketReservationRoutingModule,
    StoreModule.forFeature(
      fromTicketReservation.ticketReservationFeatureKey,
      fromTicketReservation.reducer,
    ),
    EffectsModule.forFeature([TicketReservationEffects]),
  ],
})
export class TicketReservationModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {TicketReservationEffects} from './state/ticket-reservation.effects';
import * as fromTicketReservation from './state/ticket-reservation.reducer';
import {TicketReservationRoutingModule} from './ticket-reservation-routing.module';
import {TicketReservationComponent} from './ticket-reservation.component';

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

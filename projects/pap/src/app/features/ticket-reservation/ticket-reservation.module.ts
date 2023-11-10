import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {TicketReservationRoutingModule} from './ticket-reservation-routing.module';
import {TicketReservationComponent} from './ticket-reservation.component';

@NgModule({
  declarations: [TicketReservationComponent],
  imports: [CommonModule, SharedModule, TicketReservationRoutingModule],
})
export class TicketReservationModule {}

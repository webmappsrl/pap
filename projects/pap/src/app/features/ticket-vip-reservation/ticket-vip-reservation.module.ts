import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {TicketVipReservationRoutingModule} from './ticket-vip-reservation-routing.module';
import {TicketVipReservationComponent} from './ticket-vip-reservation.component';

@NgModule({
  declarations: [TicketVipReservationComponent],
  imports: [CommonModule, SharedModule, TicketVipReservationRoutingModule],
})
export class TicketVipReservationModule {}

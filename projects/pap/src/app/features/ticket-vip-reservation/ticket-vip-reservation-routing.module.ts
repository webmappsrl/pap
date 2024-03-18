import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TicketVipReservationComponent} from './ticket-vip-reservation.component';

const routes: Routes = [{path: '', component: TicketVipReservationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketVipReservationRoutingModule {}

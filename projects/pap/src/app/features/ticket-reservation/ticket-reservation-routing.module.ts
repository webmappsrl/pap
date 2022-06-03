import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TicketReservationComponent} from './ticket-reservation.component';

const routes: Routes = [{path: '', component: TicketReservationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TicketReservationRoutingModule {}

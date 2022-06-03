import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AbandonmentTicketComponent} from './abandonment-ticket.component';

const routes: Routes = [{path: '', component: AbandonmentTicketComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AbandonmentTicketRoutingModule {}

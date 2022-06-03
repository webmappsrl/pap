import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InfoTicketComponent} from './info-ticket.component';

const routes: Routes = [{path: '', component: InfoTicketComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoTicketRoutingModule {}

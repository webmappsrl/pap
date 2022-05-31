import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportTicketComponent } from './report-ticket.component';

const routes: Routes = [{ path: '', component: ReportTicketComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportTicketRoutingModule { }

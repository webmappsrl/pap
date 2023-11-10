import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {ReportTicketRoutingModule} from './report-ticket-routing.module';
import {ReportTicketComponent} from './report-ticket.component';

@NgModule({
  declarations: [ReportTicketComponent],
  imports: [CommonModule, SharedModule, ReportTicketRoutingModule],
})
export class ReportTicketModule {}

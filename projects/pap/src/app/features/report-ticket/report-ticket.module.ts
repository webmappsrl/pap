import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {ReportTicketRoutingModule} from './report-ticket-routing.module';
import {ReportTicketComponent} from './report-ticket.component';
import {ReportTicketEffects} from './state/report-ticket.effects';
import * as fromReportTicket from './state/report-ticket.reducer';

@NgModule({
  declarations: [ReportTicketComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReportTicketRoutingModule,
    StoreModule.forFeature(fromReportTicket.reportTicketFeatureKey, fromReportTicket.reducer),
    EffectsModule.forFeature([ReportTicketEffects]),
  ],
})
export class ReportTicketModule {}

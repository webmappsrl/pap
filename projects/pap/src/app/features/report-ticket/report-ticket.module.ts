import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportTicketRoutingModule} from './report-ticket-routing.module';
import {ReportTicketComponent} from './report-ticket.component';
import {StoreModule} from '@ngrx/store';
import * as fromReportTicket from './state/report-ticket.reducer';
import {EffectsModule} from '@ngrx/effects';
import {ReportTicketEffects} from './state/report-ticket.effects';
import {SharedModule} from '../../shared/shared.module';

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

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InfoTicketRoutingModule} from './info-ticket-routing.module';
import {InfoTicketComponent} from './info-ticket.component';
import {StoreModule} from '@ngrx/store';
import * as fromInfoTicket from './state/info-ticket.reducer';
import {EffectsModule} from '@ngrx/effects';
import {InfoTicketEffects} from './state/info-ticket.effects';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [InfoTicketComponent],
  imports: [
    CommonModule,
    SharedModule,
    InfoTicketRoutingModule,
    StoreModule.forFeature(fromInfoTicket.infoTicketFeatureKey, fromInfoTicket.reducer),
    EffectsModule.forFeature([InfoTicketEffects]),
  ],
})
export class InfoTicketModule {}

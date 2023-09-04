import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {InfoTicketRoutingModule} from './info-ticket-routing.module';
import {InfoTicketComponent} from './info-ticket.component';
import {InfoTicketEffects} from './state/info-ticket.effects';
import * as fromInfoTicket from './state/info-ticket.reducer';

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

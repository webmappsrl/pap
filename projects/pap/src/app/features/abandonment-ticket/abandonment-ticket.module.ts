import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {AbandonmentTicketRoutingModule} from './abandonment-ticket-routing.module';
import {AbandonmentTicketComponent} from './abandonment-ticket.component';
import {AbandonmentTicketEffects} from './state/abandonment-ticket.effects';
import * as fromAbandonmentTicket from './state/abandonment-ticket.reducer';

@NgModule({
  declarations: [AbandonmentTicketComponent],
  imports: [
    CommonModule,
    SharedModule,
    AbandonmentTicketRoutingModule,
    StoreModule.forFeature(
      fromAbandonmentTicket.abandonmentTicketFeatureKey,
      fromAbandonmentTicket.reducer,
    ),
    EffectsModule.forFeature([AbandonmentTicketEffects]),
  ],
})
export class AbandonmentTicketModule {}

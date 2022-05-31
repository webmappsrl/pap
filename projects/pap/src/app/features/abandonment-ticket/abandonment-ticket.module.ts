import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AbandonmentTicketRoutingModule} from './abandonment-ticket-routing.module';
import {AbandonmentTicketComponent} from './abandonment-ticket.component';
import {StoreModule} from '@ngrx/store';
import * as fromAbandonmentTicket from './state/abandonment-ticket.reducer';
import {EffectsModule} from '@ngrx/effects';
import {AbandonmentTicketEffects} from './state/abandonment-ticket.effects';
import {SharedModule} from '../../shared/shared.module';

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

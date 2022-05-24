import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InfoRoutingModule} from './info-routing.module';
import {InfoComponent} from './info.component';
import {SharedModule} from '../../shared/shared.module';
import {StoreModule} from '@ngrx/store';
import * as fromInfo from './state/info.reducer';
import {EffectsModule} from '@ngrx/effects';
import {InfoEffects} from './state/info.effects';

@NgModule({
  declarations: [InfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    InfoRoutingModule,
    StoreModule.forFeature(fromInfo.infoFeatureKey, fromInfo.reducer),
    EffectsModule.forFeature([InfoEffects]),
  ],
})
export class InfoModule {}

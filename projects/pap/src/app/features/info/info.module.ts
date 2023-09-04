import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {InfoRoutingModule} from './info-routing.module';
import {InfoComponent} from './info.component';
import {InfoEffects} from './state/info.effects';
import * as fromInfo from './state/info.reducer';

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

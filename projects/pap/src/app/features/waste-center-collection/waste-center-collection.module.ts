import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WasteCenterCollectionRoutingModule} from './waste-center-collection-routing.module';
import {WasteCenterCollectionComponent} from './waste-center-collection.component';
import {StoreModule} from '@ngrx/store';
import * as fromWasteCenterCollection from './state/waste-center-collection.reducer';
import {EffectsModule} from '@ngrx/effects';
import {WasteCenterCollectionEffects} from './state/waste-center-collection.effects';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [WasteCenterCollectionComponent],
  imports: [
    CommonModule,
    SharedModule,
    WasteCenterCollectionRoutingModule,
    StoreModule.forFeature(
      fromWasteCenterCollection.wasteCenterCollectionFeatureKey,
      fromWasteCenterCollection.reducer,
    ),
    EffectsModule.forFeature([WasteCenterCollectionEffects]),
  ],
})
export class WasteCenterCollectionModule {}

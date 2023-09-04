import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {WasteCenterCollectionEffects} from './state/waste-center-collection.effects';
import * as fromWasteCenterCollection from './state/waste-center-collection.reducer';
import {WasteCenterCollectionRoutingModule} from './waste-center-collection-routing.module';
import {WasteCenterCollectionComponent} from './waste-center-collection.component';

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

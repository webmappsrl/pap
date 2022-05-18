import {NgModule} from '@angular/core';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {SharedModule} from '../../shared/shared.module';
import {StoreModule} from '@ngrx/store';
import * as fromHome from './state/home.reducer';
import {EffectsModule} from '@ngrx/effects';
import {HomeEffects} from './state/home.effects';
@NgModule({
  declarations: [HomeComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
    StoreModule.forFeature(fromHome.homeFeatureKey, fromHome.reducer),
    EffectsModule.forFeature([HomeEffects]),
  ],
})
export class HomeModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {HeaderComponent} from './header/header.component';
import * as fromHeader from './header/state/header.reducer';
import {HeaderEffects} from './header/state/header.effects';
import {MapComponent} from './map/map.component';
import * as fromMap from './map/state/map.reducer';
import {MapEffects} from './map/state/map.effects';

@NgModule({
  declarations: [HeaderComponent, MapComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    HttpClientModule,
    StoreModule.forFeature(fromHeader.headerFeatureKey, fromHeader.reducer),
    EffectsModule.forFeature([HeaderEffects, MapEffects]),
    StoreModule.forFeature(fromMap.mapFeatureKey, fromMap.reducer),
  ],
  exports: [
    CommonModule,
    RouterModule,
    IonicModule,
    HttpClientModule,
    HeaderComponent,
    MapComponent,
  ],
})
export class SharedModule {}

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
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ErrorFormHandlerComponent} from './error-form-handler/error-form-handler';
import {TranslateModule} from '@ngx-translate/core';
import {MapComponent} from './map/map.component';

@NgModule({
  declarations: [HeaderComponent, ErrorFormHandlerComponent, MapComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    HttpClientModule,
    LeafletModule,
    StoreModule.forFeature(fromHeader.headerFeatureKey, fromHeader.reducer),
    TranslateModule.forRoot(),
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HttpClientModule,
    HeaderComponent,
    MapComponent,
    ErrorFormHandlerComponent,
    TranslateModule,
  ],
})
export class SharedModule {}

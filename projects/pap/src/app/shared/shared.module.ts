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

@NgModule({
  declarations: [HeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    HttpClientModule,
    StoreModule.forFeature(fromHeader.headerFeatureKey, fromHeader.reducer),
    EffectsModule.forFeature([HeaderEffects]),
  ],
  exports: [CommonModule, RouterModule, IonicModule, HttpClientModule, HeaderComponent],
})
export class SharedModule {}

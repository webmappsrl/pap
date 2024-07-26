import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {AuthEffects} from './state/auth.effects';
import * as fromAuth from './state/auth.reducer';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
    SharedModule,
  ],
})
export class AuthModule {}

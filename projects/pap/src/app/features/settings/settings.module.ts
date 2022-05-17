import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings.component';
import {StoreModule} from '@ngrx/store';
import * as fromSettings from './state/settings.reducer';
import {EffectsModule} from '@ngrx/effects';
import {SettingsEffects} from './state/settings.effects';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    SettingsRoutingModule,
    StoreModule.forFeature(fromSettings.settingsFeatureKey, fromSettings.reducer),
    EffectsModule.forFeature([SettingsEffects]),
  ],
})
export class SettingsModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsComponent} from './reports.component';
import {StoreModule} from '@ngrx/store';
import * as fromReports from './state/reports.reducer';
import {EffectsModule} from '@ngrx/effects';
import {ReportsEffects} from './state/reports.effects';
import {SharedModule} from '../../shared/shared.module';
import {ReportsDetailComponent} from './reports-detail.component';

@NgModule({
  declarations: [ReportsComponent, ReportsDetailComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromReports.reportsFeatureKey, fromReports.reducer),
    EffectsModule.forFeature([ReportsEffects]),
  ],
})
export class ReportsModule {}

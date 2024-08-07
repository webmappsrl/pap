import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {DustyManReportsDetailComponent} from './dusty-man-reports-detail.component';
import {ReportsRoutingModule} from './dusty-man-reports-routing.module';
import {DustyManReportsComponent} from './dusty-man-reports.component';
import * as fromReports from '../reports/state/reports.reducer';
import {ReportsEffects} from '../reports/state/reports.effects';

@NgModule({
  declarations: [DustyManReportsComponent, DustyManReportsDetailComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromReports.reportsFeatureKey, fromReports.reducer),
    EffectsModule.forFeature([ReportsEffects]),
  ],
})
export class DustyManReportsModule {}

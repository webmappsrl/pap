import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {SharedModule} from '../../shared/shared.module';
import {ReportsDetailComponent} from './reports-detail.component';
import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsComponent} from './reports.component';
import {ReportsEffects} from './state/reports.effects';
import * as fromReports from './state/reports.reducer';

@NgModule({
  declarations: [ReportsComponent, ReportsDetailComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
  ],
})
export class ReportsModule {}

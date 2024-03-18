import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DustyManReportsComponent} from './dusty-man-reports.component';
import {DustyManReportsDetailComponent} from './dusty-man-reports-detail.component';

const routes: Routes = [
  {path: '', component: DustyManReportsComponent},
  {path: ':id', component: DustyManReportsDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

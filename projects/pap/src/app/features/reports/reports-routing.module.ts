import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from './reports.component';
import {ReportsDetailComponent} from './reports-detail.component';

const routes: Routes = [
  {path: '', component: ReportsComponent},
  {path: ':id', component: ReportsDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}

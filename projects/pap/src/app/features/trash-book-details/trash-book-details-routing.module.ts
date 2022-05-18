import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrashBookDetailsComponent } from './trash-book-details.component';

const routes: Routes = [{ path: '', component: TrashBookDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashBookDetailsRoutingModule { }

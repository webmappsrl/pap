import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrashBookComponent } from './trash-book.component';

const routes: Routes = [{ path: '', component: TrashBookComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrashBookRoutingModule { }

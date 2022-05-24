import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../../core/auth/auth.guard';
import {TrashBookDetailsComponent} from './trash-book-details/trash-book-details.component';
import {TrashBookComponent} from './trash-book.component';

const routes: Routes = [
  {path: '', component: TrashBookComponent, canActivate: [AuthGuard]},
  {path: 'detail', component: TrashBookDetailsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashBookRoutingModule {}

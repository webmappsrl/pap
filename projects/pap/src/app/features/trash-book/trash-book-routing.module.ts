import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TrashBookDetailsComponent} from './trash-book-details/trash-book-details.component';
import {TrashBookComponent} from './trash-book.component';

const routes: Routes = [
  {path: '', component: TrashBookComponent},
  {path: 'detail', component: TrashBookDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrashBookRoutingModule {}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full', // if no route redirect to home
  },
  {path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule)},
  { path: 'trashbook', loadChildren: () => import('./features/trash-book/trash-book.module').then(m => m.TrashBookModule) },
  {
    path: '**',
    redirectTo: 'home', // all no defined route redirect to home
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

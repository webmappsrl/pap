import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WasteCenterCollectionComponent } from './waste-center-collection.component';

const routes: Routes = [{ path: '', component: WasteCenterCollectionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WasteCenterCollectionRoutingModule { }

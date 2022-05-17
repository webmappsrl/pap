import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrashBookRoutingModule } from './trash-book-routing.module';
import { TrashBookComponent } from './trash-book.component';


@NgModule({
  declarations: [
    TrashBookComponent
  ],
  imports: [
    CommonModule,
    TrashBookRoutingModule
  ]
})
export class TrashBookModule { }

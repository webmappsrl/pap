import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {TrashBookDetailsComponent} from './trash-book-details/trash-book-details.component';
import {TrashBookRoutingModule} from './trash-book-routing.module';
import {TrashBookTypeComponent} from './trash-book-type/trash-book-type.component';
import {TrashBookComponent} from './trash-book.component';

@NgModule({
  declarations: [TrashBookComponent, TrashBookDetailsComponent, TrashBookTypeComponent],
  imports: [CommonModule, SharedModule, TrashBookRoutingModule],
})
export class TrashBookModule {}

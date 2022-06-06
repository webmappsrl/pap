import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TrashBookRoutingModule} from './trash-book-routing.module';
import {TrashBookComponent} from './trash-book.component';
import {SharedModule} from '../../shared/shared.module';
import {TrashBookDetailsComponent} from './trash-book-details/trash-book-details.component';
import {TrashBookTypeComponent} from './trash-book-type/trash-book-type.component';

@NgModule({
  declarations: [TrashBookComponent, TrashBookDetailsComponent, TrashBookTypeComponent],
  imports: [CommonModule, SharedModule, TrashBookRoutingModule],
})
export class TrashBookModule {}

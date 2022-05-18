import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TrashBookDetailsRoutingModule} from './trash-book-details-routing.module';
import {TrashBookDetailsComponent} from './trash-book-details.component';
import {StoreModule} from '@ngrx/store';
import * as fromTrashBookDetails from './state/trash-book-details.reducer';
import {EffectsModule} from '@ngrx/effects';
import {TrashBookDetailsEffects} from './state/trash-book-details.effects';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [TrashBookDetailsComponent],
  imports: [
    CommonModule,
    SharedModule,
    TrashBookDetailsRoutingModule,
    StoreModule.forFeature(
      fromTrashBookDetails.trashBookDetailsFeatureKey,
      fromTrashBookDetails.reducer,
    ),
    EffectsModule.forFeature([TrashBookDetailsEffects]),
  ],
})
export class TrashBookDetailsModule {}

import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromTrashBookDetails from './trash-book-details.reducer';

export const selectTrashBookDetailsState =
  createFeatureSelector<fromTrashBookDetails.trashBookDetailsState>(
    fromTrashBookDetails.trashBookDetailsFeatureKey,
  );

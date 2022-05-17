import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromTrashBook from './trash-book.reducer';

export const selectTrashBookState = createFeatureSelector<fromTrashBook.State>(
  fromTrashBook.trashBookFeatureKey,
);

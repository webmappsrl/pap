import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromTrashBook from './trash-book.reducer';

export const selectTrashBookState = createFeatureSelector<fromTrashBook.TrashBookState>(
  fromTrashBook.trashBookFeatureKey,
);
export const selectedTrashBookDetail = createSelector(
  selectTrashBookState,
  state => state.trashBookDetail,
);
export const selectedTrashBookType = createSelector(
  selectTrashBookState,
  state => state.trashBookType,
);
export const trashBookTypes = createSelector(selectTrashBookState, state => state.trashBookTypes);
export const TrashBookError = createSelector(
  selectTrashBookState,
  state => state != null && state.error,
);

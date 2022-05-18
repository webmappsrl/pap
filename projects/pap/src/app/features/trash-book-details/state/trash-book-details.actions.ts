import {createAction, props} from '@ngrx/store';
import {TrashBookRow} from '../../trash-book/trash-book-model';

export const loadTrashBookDetailss = createAction('[TrashBookDetails] Load TrashBookDetailss');

export const loadTrashBookDetailssSuccess = createAction(
  '[TrashBookDetails] Load TrashBookDetailss Success',
  props<{data: any}>(),
);

export const loadTrashBookDetailssFailure = createAction(
  '[TrashBookDetails] Load TrashBookDetailss Failure',
  props<{error: any}>(),
);

export const setTrashBookDetails = createAction(
  '[TrashBookDetails] Load TrashBookDetailss Failure',
  props<{trashBookRow: TrashBookRow}>(),
);

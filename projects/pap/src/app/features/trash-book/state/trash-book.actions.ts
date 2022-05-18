import {createAction, props} from '@ngrx/store';
import {TrashBookRow} from '../trash-book-model';

export const loadTrashBooks = createAction('[TrashBook] Load TrashBooks');

export const loadTrashBooksSuccess = createAction(
  '[TrashBook] Load TrashBooks Success',
  props<{data: TrashBookRow[]}>(),
);

export const loadTrashBooksFailure = createAction(
  '[TrashBook] Load TrashBooks Failure',
  props<{error: any}>(),
);

export const filterTrashBooks = createAction(
  '[TrashBook] filter TrashBooks',
  props<{filter: string}>(),
);

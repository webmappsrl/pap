import {createAction, props} from '@ngrx/store';

export const loadTrashBooks = createAction('[TrashBook] Load TrashBooks');

export const loadTrashBooksSuccess = createAction(
  '[TrashBook] Load TrashBooks Success',
  props<{data: any}>(),
);

export const loadTrashBooksFailure = createAction(
  '[TrashBook] Load TrashBooks Failure',
  props<{error: any}>(),
);

import {Action, createReducer, on} from '@ngrx/store';
import {TrashBookRow} from '../trash-book-model';
import * as TrashBookActions from './trash-book.actions';

export const trashBookFeatureKey = 'trashBook';

export interface TrashBookState {
  trashBook: TrashBookRow[];
}

export const initialState: TrashBookState = {
  trashBook: [],
};

export const reducer = createReducer(
  initialState,
  on(TrashBookActions.loadTrashBooks, state => state),
  on(TrashBookActions.loadTrashBooksSuccess, (state, action) => state),
  on(TrashBookActions.loadTrashBooksFailure, (state, action) => state),
);

export function trashBookReducer(
  state: TrashBookState | undefined,
  action: Action,
): TrashBookState {
  return reducer(state, action);
}

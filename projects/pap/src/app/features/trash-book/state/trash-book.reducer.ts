import {Action, createReducer, on} from '@ngrx/store';
import * as TrashBookActions from './trash-book.actions';

export const trashBookFeatureKey = 'trashBook';

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(TrashBookActions.loadTrashBooks, state => state),
  on(TrashBookActions.loadTrashBooksSuccess, (state, action) => state),
  on(TrashBookActions.loadTrashBooksFailure, (state, action) => state),
);

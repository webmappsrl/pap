import {Action, createReducer, on} from '@ngrx/store';
import {TrashBookRow} from '../../trash-book/trash-book-model';
import * as TrashBookDetailsActions from './trash-book-details.actions';

export const trashBookDetailsFeatureKey = 'trashBookDetails';

export interface trashBookDetailsState {
  selected?: TrashBookRow;
}

export const initialState: trashBookDetailsState = {
  selected: undefined,
};

export const reducer = createReducer(
  initialState,

  on(TrashBookDetailsActions.loadTrashBookDetailss, state => state),
  on(TrashBookDetailsActions.loadTrashBookDetailssSuccess, (state, action) => state),
  on(TrashBookDetailsActions.loadTrashBookDetailssFailure, (state, action) => state),
  on(TrashBookDetailsActions.setTrashBookDetails, (state, action) => ({
    ...state,
    selected: action.trashBookRow,
  })),
);

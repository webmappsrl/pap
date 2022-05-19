import {Action, createReducer, on} from '@ngrx/store';
import {TrashBookRow} from '../trash-book-model';
import * as TrashBookActions from './trash-book.actions';

export const trashBookFeatureKey = 'trashBook';

export interface TrashBookState {
  trashBook: TrashBookRow[];
  trashBookDetail?: TrashBookRow;
}

export const initialState: TrashBookState = {
  trashBook: [],
};

export const reducer = createReducer(
  initialState,
  on(TrashBookActions.loadTrashBooks, state => state),
  on(TrashBookActions.loadTrashBooksSuccess, (state, action) => ({
    ...state,
    trashBook: action.data,
  })),
  on(TrashBookActions.loadTrashBooksFailure, (state, action) => ({...state, error: action.error})),
  on(TrashBookActions.filterTrashBooks, (state, action) => ({
    ...state,
    trashBook: state.trashBook.map(x => {
      let y = Object.assign({}, x);
      y.hide = !!action.filter && !x.name.toLowerCase().includes(action.filter.toLowerCase());
      return y;
    }),
  })),
  on(TrashBookActions.setTrashBookDetail, (state, action) => ({
    ...state,
    trashBookDetail: action.trashBookDetail,
  })),
);

export function trashBookReducer(
  state: TrashBookState | undefined,
  action: Action,
): TrashBookState {
  return reducer(state, action);
}

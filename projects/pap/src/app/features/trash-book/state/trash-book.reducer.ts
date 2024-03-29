import {Action, createReducer, on} from '@ngrx/store';
import {TrashBookRow, TrashBookType} from '../trash-book-model';
import * as TrashBookActions from './trash-book.actions';

export const trashBookFeatureKey = 'trashBook';

export interface TrashBookState {
  error: string;
  trashBook: TrashBookRow[];
  trashBookDetail?: TrashBookRow;
  trashBookType?: TrashBookType;
  trashBookTypes: TrashBookType[];
}

export const initialState: TrashBookState = {
  trashBook: [],
  trashBookTypes: [],
  error: '',
};

export const reducer = createReducer(
  initialState,
  on(TrashBookActions.loadTrashBooks, state => state),
  on(TrashBookActions.loadTrashBooksSuccess, (state, action) => ({
    ...state,
    trashBook: action.data.trashBookRows,
    trashBookTypes: action.data.trashBookTypes,
  })),
  on(TrashBookActions.loadTrashBooksFailure, (state, action) => {
    return {...state, error: 'error'};
  }),
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
    trashBookType: action.trashBookDetail.trashBookType,
  })),
  on(TrashBookActions.setTrashBookType, (state, action) => ({
    ...state,
    trashBookType: action.trashBookType,
  })),
);

export function trashBookReducer(
  state: TrashBookState | undefined,
  action: Action,
): TrashBookState {
  return reducer(state, action);
}

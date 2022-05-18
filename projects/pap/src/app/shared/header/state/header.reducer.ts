import {Action, createReducer, on} from '@ngrx/store';
import {headerInfo} from '../header.model';
import * as HeaderActions from './header.actions';

export const headerFeatureKey = 'header';

export interface HeaderState {
  header: headerInfo;
  error: string;
}

export const initialState: HeaderState = {
  header: {
    showBack: false,
    isMenuOpen: false,
  },
  error: '',
};

export const reducer = createReducer(
  initialState,

  on(HeaderActions.loadHeaders, state => state),
  on(HeaderActions.loadHeadersSuccess, (state, action) => ({...state, header: action.data})),
  on(HeaderActions.loadHeadersFailure, (state, action) => ({...state, error: action.error})),
  on(HeaderActions.openMenu, (state, action) => ({
    ...state,
    header: {...state.header, isMenuOpen: true},
  })),
  on(HeaderActions.closeMenu, (state, action) => ({
    ...state,
    header: {...state.header, isMenuOpen: false},
  })),
  on(HeaderActions.showButtons, state => state),
);

export function headerReducer(state: HeaderState | undefined, action: Action): HeaderState {
  return reducer(state, action);
}

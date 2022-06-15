import {Action, createReducer, on} from '@ngrx/store';
import {menuButton} from '../menu.model';
import * as HeaderActions from './menu.actions';

export const headerFeatureKey = 'header';

export interface MenuState {
  header: menuButton;
  error: string;
}

export const initialState: MenuState = {
  header: {
    showBack: false,
    isMenuOpen: false,
  },
  error: '',
};

export const reducer = createReducer(
  initialState,

  on(HeaderActions.loadMenu, state => state),
  on(HeaderActions.loadMenuSuccess, (state, action) => ({...state, header: action.data})),
  on(HeaderActions.loadMenuFailure, (state, action) => ({...state, error: action.error})),
  on(HeaderActions.openMenu, (state, action) => ({
    ...state,
    header: {...state.header, isMenuOpen: true},
  })),
  on(HeaderActions.closeMenu, (state, action) => ({
    ...state,
    header: {...state.header, isMenuOpen: false},
  })),
  on(HeaderActions.showButtons, state => ({...state})),
);

export function headerReducer(state: MenuState | undefined, action: Action): MenuState {
  return reducer(state, action);
}

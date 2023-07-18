import {Action, createReducer, on} from '@ngrx/store';
import {footerInfo} from '../footer.model';
import * as FooterActions from './footer.actions';

export const footerFeatureKey = 'footer';

export interface FooterState {
  error: string;
  footer: footerInfo;
}

export const initialState: FooterState = {
  footer: {
    showBack: false,
    isMenuOpen: false,
  },
  error: '',
};

export const reducer = createReducer(
  initialState,

  on(FooterActions.loadFooters, state => state),
  on(FooterActions.loadFootersSuccess, (state, action) => ({...state, footer: action.data})),
  on(FooterActions.loadFootersFailure, (state, action) => ({...state, error: action.error})),
  on(FooterActions.openMenu, (state, action) => ({
    ...state,
    footer: {...state.footer, isMenuOpen: true},
  })),
  on(FooterActions.closeMenu, (state, action) => ({
    ...state,
    footer: {...state.footer, isMenuOpen: false},
  })),
  on(FooterActions.showButtons, state => ({...state})),
);

export function footerReducer(state: FooterState | undefined, action: Action): FooterState {
  return reducer(state, action);
}

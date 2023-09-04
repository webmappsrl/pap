import {Action, createReducer, on} from '@ngrx/store';
import {LayoutState} from '../layout.model';
import * as LayoutActions from './layout.actions';

export const mainLayoutFeatureKey = 'mainLayout';

export const initialState: LayoutState = {
  scss: '',
  error: '',
};

export const reducer = createReducer(
  initialState,

  on(LayoutActions.yLayouts, state => state),
  on(LayoutActions.yLayoutsSuccess, (state, action) => ({
    ...state,
    scss: action.scss,
  })),
  on(LayoutActions.yLayoutsFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
);

export function layoutReducer(state: LayoutState | undefined, action: Action): LayoutState {
  return reducer(state, action);
}

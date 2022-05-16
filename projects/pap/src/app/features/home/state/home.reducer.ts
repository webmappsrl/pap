import {Action, createReducer, on} from '@ngrx/store';
import {buttonInfo} from '../home.model';
import * as HomeActions from './home.actions';

export const homeFeatureKey = 'home';

export interface HomeState {
  buttons: buttonInfo[];
  error: string;
}

export const initialState: HomeState = {
  buttons: [],
  error: '',
};

export const reducer = createReducer(
  initialState,

  on(HomeActions.yHomes, state => state),
  on(HomeActions.yHomesSuccess, (state, action) => ({...state, buttons: action.buttons})),
  on(HomeActions.yHomesFailure, (state, action) => ({...state, error: action.error})),
);

export function homeReducer(state: HomeState | undefined, action: Action): HomeState {
  return reducer(state, action);
}

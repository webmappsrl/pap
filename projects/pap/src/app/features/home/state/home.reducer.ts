import { Action, createReducer, on } from '@ngrx/store';
import * as HomeActions from './home.actions';

export const homeFeatureKey = 'home';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,

  on(HomeActions.yHomes, state => state),
  on(HomeActions.yHomesSuccess, (state, action) => state),
  on(HomeActions.yHomesFailure, (state, action) => state),

);

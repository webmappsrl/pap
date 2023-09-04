import {createReducer, on} from '@ngrx/store';
import * as InfoActions from './info.actions';

export const infoFeatureKey = 'info';

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(InfoActions.loadInfos, state => state),
  on(InfoActions.loadInfosSuccess, (state, action) => state),
  on(InfoActions.loadInfosFailure, (state, action) => state),
);

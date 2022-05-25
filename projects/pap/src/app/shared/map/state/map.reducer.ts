import {Action, createReducer, on} from '@ngrx/store';
import * as MapActions from './map.actions';

export const mapFeatureKey = 'map';

export interface State {}

export const initialState: State = {};

export const reducer = createReducer(
  initialState,

  on(MapActions.loadMaps, state => state),
  on(MapActions.loadMapsSuccess, (state, action) => state),
  on(MapActions.loadMapsFailure, (state, action) => state),
);

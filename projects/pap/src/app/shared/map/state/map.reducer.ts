import {Actions} from '@ngrx/effects';
import {Action, createReducer, on} from '@ngrx/store';
import * as MapActions from './map.actions';

export const mapFeatureKey = 'map';

export interface State {
  currentMarkerCoords: [number, number] | [];
  currentMarkerAddress: string;
  error: string;
}

export const initialState: State = {
  currentMarkerCoords: [],
  currentMarkerAddress: '',
  error: '',
};

export const reducer = createReducer(
  initialState,

  on(MapActions.loadMaps, state => state),
  on(MapActions.loadMapsSuccess, (state, action) => state),
  on(MapActions.loadMapsFailure, (state, action) => state),
  on(MapActions.setMarker, (state, action) => ({
    ...state,
    currentMarkerCoords: action.coords,
  })),
  on(MapActions.setCurrentMarkerSuccess, (state, action) => ({
    ...state,
    currentMarkerAddress: action.address,
  })),
  on(MapActions.setCurrentMarkerFailure, (state, action) => ({
    ...state,
    error: action.error,
  })),
);

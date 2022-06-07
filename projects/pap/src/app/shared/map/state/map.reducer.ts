import {Actions} from '@ngrx/effects';
import {Action, createReducer, on} from '@ngrx/store';
import * as MapActions from './map.actions';

export const mapFeatureKey = 'map';

export interface State {
  currentMarkerCoords: [number, number] | [];
  error: string;
  currentMarkerAddress?: string;
}

export const initialState: State = {
  currentMarkerCoords: [],
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
    currentMarkerAddress: undefined,
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

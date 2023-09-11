import {createReducer, on} from '@ngrx/store';
import * as MapActions from './map.actions';
import {Feature} from '../../form/location/location.model';

export const mapFeatureKey = 'map';

export interface State {
  confiniZone: Feature[];
  currentMarkerAddress?: string;
  currentMarkerCoords: number[];
  error: string;
  validZone: boolean;
}

export const initialState: State = {
  currentMarkerCoords: [],
  confiniZone: [],
  validZone: false,
  error: '',
};

export const reducer = createReducer(
  initialState,

  on(MapActions.loadMaps, state => state),
  on(MapActions.loadMapsSuccess, (state, action) => state),
  on(MapActions.loadMapsFailure, (state, action) => state),
  on(MapActions.setMarker, (state, action) => ({
    ...state,
    currentMarkerCoords: [action.coords[0], action.coords[1]],
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
  on(MapActions.loadConfiniZone, state => ({
    ...state,
    confiniZone: [],
  })),
  on(MapActions.loadConfiniZoneSuccess, (state, action) => ({
    ...state,
    confiniZone: action.data.features,
  })),
  on(MapActions.loadConfiniZoneFailure, (state, action) => state),
);

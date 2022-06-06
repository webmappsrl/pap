import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromMap from './map.reducer';

export const selectMapState = createFeatureSelector<fromMap.State>(fromMap.mapFeatureKey);
export const currentAddress = createSelector(selectMapState, state => state.currentMarkerAddress);

import {createFeatureSelector, createSelector} from '@ngrx/store';
import Feature from 'ol/Feature';
import MultiPolygon from 'ol/geom/MultiPolygon';
import * as fromMap from './map.reducer';

export const selectMapState = createFeatureSelector<fromMap.State>(fromMap.mapFeatureKey);
export const currentAddress = createSelector(selectMapState, state => state.currentMarkerAddress);
export const confiniZone = createSelector(selectMapState, state => state.confiniZone ?? []);

export const currentMarkerCoords = createSelector(
  selectMapState,
  state => state.currentMarkerCoords,
);

export const currentZone = createSelector(confiniZone, currentMarkerCoords, (confini, coords) => {
  if (confini.length > 0 && coords.length > 0) {
    const confiniIn: any[] = confini.filter(c => {
      const ffea = new Feature({
        geometry: new MultiPolygon(c.geometry.coordinates),
      });
      return ffea.getGeometry()!.intersectsCoordinate(coords);
    });

    return confiniIn[0] ?? undefined;
  }
  return undefined;
});

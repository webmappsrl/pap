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
      let polygon = new MultiPolygon(c.geometry.coordinates);
      return polygon.intersectsCoordinate(coords);
    });
    const confiniInMulti: any[] = confini.filter(c => {
      if (c.geometry.coordinates[0][0].length > 1) {
        let polygonGeometries = c.geometry.coordinates[0];
        for (const polygonGeometry of polygonGeometries) {
          let polygon = new MultiPolygon([[polygonGeometry]]);
          if (polygon.intersectsCoordinate(coords)) {
            return true;
          }
        }
        return false;
      }
      return false;
    });

    return confiniIn[0] ?? confiniInMulti[0] ?? undefined;
  }
  return undefined;
});

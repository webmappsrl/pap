import {createAction, props} from '@ngrx/store';
import {GeoJsonFeatureCollection} from '../../form/location/location.model';

export const loadMaps = createAction('[Map] Load Maps');

export const loadMapsSuccess = createAction('[Map] Load Maps Success', props<{data: any}>());

export const loadMapsFailure = createAction('[Map] Load Maps Failure', props<{error: string}>());

export const setMarker = createAction(
  '[Map] set current marker',
  props<{coords: [number, number]}>(),
);

export const setCurrentMarkerSuccess = createAction(
  '[Map] set current marker success',
  props<{address: string}>(),
);
export const setCurrentMarkerFailure = createAction(
  '[Map] set current marker Failure',
  props<{error: string}>(),
);

export const loadConfiniZone = createAction('[Map] Load confini zone');

export const loadConfiniZoneSuccess = createAction(
  '[Map] Load confini zone Success',
  props<{data: GeoJsonFeatureCollection}>(),
);

export const loadConfiniZoneFailure = createAction(
  '[Map] Load confini zone Failure',
  props<{error: string}>(),
);
export const resetCurrentZone = createAction('[Map] reset current zone');

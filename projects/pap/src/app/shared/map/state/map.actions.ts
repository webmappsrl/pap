import {createAction, props} from '@ngrx/store';

export const loadMaps = createAction('[Map] Load Maps');

export const loadMapsSuccess = createAction('[Map] Load Maps Success', props<{data: any}>());

export const loadMapsFailure = createAction('[Map] Load Maps Failure', props<{error: any}>());

export const setMarker = createAction(
  '[Map] set current marker',
  props<{coords: [number, number]}>(),
);

export const setCurrentMarkerSuccess = createAction(
  '[Map] set current marker success',
  props<{address: any}>(),
);
export const setCurrentMarkerFailure = createAction(
  '[Map] set current marker Failure',
  props<{error: any}>(),
);

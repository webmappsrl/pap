import {createAction, props} from '@ngrx/store';

export const loadWasteCenterCollections = createAction(
  '[WasteCenterCollection] Load WasteCenterCollections',
);

export const loadWasteCenterCollectionsSuccess = createAction(
  '[WasteCenterCollection] Load WasteCenterCollections Success',
  props<{data: any}>(),
);

export const loadWasteCenterCollectionsFailure = createAction(
  '[WasteCenterCollection] Load WasteCenterCollections Failure',
  props<{error: any}>(),
);

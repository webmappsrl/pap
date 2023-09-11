import {createAction, props} from '@ngrx/store';
import {WasteCenterCollectionFeature} from '../waste-center-collection-model';

export const loadWasteCenterCollections = createAction(
  '[WasteCenterCollection] Load WasteCenterCollections',
);

export const loadWasteCenterCollectionsSuccess = createAction(
  '[WasteCenterCollection] Load WasteCenterCollections Success',
  props<{data: WasteCenterCollectionFeature[]}>(),
);

export const loadWasteCenterCollectionsFailure = createAction(
  '[WasteCenterCollection] Load WasteCenterCollections Failure',
  props<{error: string}>(),
);

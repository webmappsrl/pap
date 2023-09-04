import {createFeatureSelector} from '@ngrx/store';
import * as fromWasteCenterCollection from './waste-center-collection.reducer';

export const selectWasteCenterCollectionState =
  createFeatureSelector<fromWasteCenterCollection.WasteCenterCollectionState>(
    fromWasteCenterCollection.wasteCenterCollectionFeatureKey,
  );

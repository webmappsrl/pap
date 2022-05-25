import {Action, createReducer, on} from '@ngrx/store';
import {WasteCenterCollectionFeature} from '../waste-center-collection-model';
import * as WasteCenterCollectionActions from './waste-center-collection.actions';

export const wasteCenterCollectionFeatureKey = 'wasteCenterCollection';

export interface WasteCenterCollectionState {
  wasteCenterCollection: WasteCenterCollectionFeature[];
}

export const initialState: WasteCenterCollectionState = {
  wasteCenterCollection: [],
};

export const reducer = createReducer(
  initialState,

  on(WasteCenterCollectionActions.loadWasteCenterCollections, state => state),
  on(WasteCenterCollectionActions.loadWasteCenterCollectionsSuccess, (state, action) => ({
    ...state,
    wasteCenterCollection: action.data,
  })),
  on(WasteCenterCollectionActions.loadWasteCenterCollectionsFailure, (state, action) => state),
);

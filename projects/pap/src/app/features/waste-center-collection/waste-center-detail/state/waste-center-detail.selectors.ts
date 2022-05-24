import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromWasteCenterDetail from './waste-center-detail.reducer';

export const selectWasteCenterDetailState = createFeatureSelector<fromWasteCenterDetail.State>(
  fromWasteCenterDetail.wasteCenterDetailFeatureKey
);

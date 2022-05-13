import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromHome from './home.reducer';

export const selectHomeState = createFeatureSelector<fromHome.State>(
  fromHome.homeFeatureKey
);

import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromLayout from './layout.reducer';

export const selectLayoutState = createFeatureSelector<fromLayout.State>(
  fromLayout.mainLayoutFeatureKey,
);

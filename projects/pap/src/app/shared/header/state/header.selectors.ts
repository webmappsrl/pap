import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromHeader from './header.reducer';

export const selectHeaderState = createFeatureSelector<fromHeader.HeaderState>(
  fromHeader.headerFeatureKey,
);

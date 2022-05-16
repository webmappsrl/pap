import {createFeatureSelector} from '@ngrx/store';
import {LayoutState} from '../layout.model';
import * as fromLayout from './layout.reducer';

export const selectLayoutState = createFeatureSelector<LayoutState>(
  fromLayout.mainLayoutFeatureKey,
);

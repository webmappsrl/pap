import {createFeatureSelector} from '@ngrx/store';
import * as fromHome from './home.reducer';

export const selectHomeState = createFeatureSelector<fromHome.HomeState>(fromHome.homeFeatureKey);

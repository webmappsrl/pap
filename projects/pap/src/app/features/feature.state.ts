import {ActionReducerMap, createFeatureSelector} from '@ngrx/store';
import {AppState} from '../core/core.state';

import {homeReducer, HomeState} from './home/state/home.reducer';

export const FEATURE_NAME = 'features';
export const selectExamples = createFeatureSelector<State, FeatureState>(FEATURE_NAME);
export const reducers: ActionReducerMap<FeatureState> = {
  home: homeReducer,
};

export interface FeatureState {
  home: HomeState;
}

export interface State extends AppState {
  features: FeatureState;
}

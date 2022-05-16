import {ActionReducerMap, createFeatureSelector, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {homeReducer, HomeState} from '../features/home/state/home.reducer';
import {LayoutState} from './layout/layout.model';
import {layoutReducer} from './layout/state/layout.reducer';

export const reducers: ActionReducerMap<AppState> = {
  layout: layoutReducer,
  home: homeReducer,
};

export interface AppState {
  layout: LayoutState;
  home: HomeState;
}

export const selectLayoutState = createFeatureSelector<AppState, LayoutState>('layout');

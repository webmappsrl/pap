import {ActionReducerMap, createFeatureSelector, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {LayoutState} from './layout/state/layout.model';
import {layoutReducer} from './layout/state/layout.reducer';

export const reducers: ActionReducerMap<AppState> = {
  layout: layoutReducer,
};

export interface AppState {
  layout: LayoutState;
}

export const selectLayoutState = createFeatureSelector<AppState, LayoutState>('layout');

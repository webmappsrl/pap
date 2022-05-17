import {ActionReducerMap, createFeatureSelector, MetaReducer} from '@ngrx/store';
import {LayoutState} from './layout/layout.model';
import {layoutReducer} from './layout/state/layout.reducer';

export const reducers: ActionReducerMap<AppState> = {
  layout: layoutReducer,
};

export interface AppState {
  layout: LayoutState;
}

export const selectLayoutState = createFeatureSelector<AppState, LayoutState>('layout');

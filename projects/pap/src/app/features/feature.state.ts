import {ActionReducerMap} from '@ngrx/store';
import {AppState} from '../core/core.state';

import {homeReducer, HomeState} from './home/state/home.reducer';
import {trashBookReducer, TrashBookState} from './trash-book/state/trash-book.reducer';

export const FEATURE_NAME = 'features';
export const reducers: ActionReducerMap<FeatureState> = {
  home: homeReducer,
  trashBook: trashBookReducer,
};

export interface FeatureState {
  home: HomeState;
  trashBook: TrashBookState;
}

export interface State extends AppState {
  features: FeatureState;
}

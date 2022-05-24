import { Action, createReducer, on } from '@ngrx/store';
import * as WasteCenterDetailActions from './waste-center-detail.actions';

export const wasteCenterDetailFeatureKey = 'wasteCenterDetail';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,

  on(WasteCenterDetailActions.loadWasteCenterDetails, state => state),
  on(WasteCenterDetailActions.loadWasteCenterDetailsSuccess, (state, action) => state),
  on(WasteCenterDetailActions.loadWasteCenterDetailsFailure, (state, action) => state),

);

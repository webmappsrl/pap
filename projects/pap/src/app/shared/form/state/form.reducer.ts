import { Action, createReducer, on } from '@ngrx/store';
import * as FormActions from './form.actions';

export const formFeatureKey = 'form';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,

  on(FormActions.loadForms, state => state),
  on(FormActions.loadFormsSuccess, (state, action) => state),
  on(FormActions.loadFormsFailure, (state, action) => state),

);

import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromForm from './form.reducer';

export const selectFormState = createFeatureSelector<fromForm.State>(
  fromForm.formFeatureKey
);

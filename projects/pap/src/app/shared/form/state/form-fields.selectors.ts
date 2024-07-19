import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FormJsonState } from "./form-fields.reducer";
import * as fromFormJson from './form-fields.reducer';

export const selectFormJsonState = createFeatureSelector<FormJsonState>(fromFormJson.formJsonFeatureKey);
export const selectFormJson = createSelector(selectFormJsonState, state => state.formJson);
export const selectFormJsonByStep = (step: number) => createSelector(
  selectFormJsonState,
  state => state.formJson?.filter(item => item.step === step)
);
export const selectRequiredFields = createSelector(
  selectFormJsonState,
  state => state.formJson?.filter(field => (
    field.validators?.some(validator => validator.name === 'required') &&
    field.id !== 'password' &&
    field.id !== 'password_confirmation'
  ))
);
export const selectError = createSelector(selectFormJsonState, state => state.error);
export const selectLoading = createSelector(selectFormJsonState, state => state.loading);

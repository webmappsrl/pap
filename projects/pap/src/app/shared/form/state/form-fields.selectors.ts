import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FormJsonState } from "./form-fields.reducer";
import * as fromFormJson from './form-fields.reducer';

export const selectFormJsonState = createFeatureSelector<FormJsonState>(fromFormJson.formJsonFeatureKey);
export const selectFormJson = createSelector(selectFormJsonState, state => state.formJson);
export const selectFormJsonByStep = (step: number) => createSelector(
  selectFormJsonState,
  state => state.formJson?.filter(item => item.step === step)
);
export const selectError = createSelector(selectFormJsonState, state => state.error);
export const selectLoading = createSelector(selectFormJsonState, state => state.loading);

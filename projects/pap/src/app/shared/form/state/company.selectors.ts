import {createFeatureSelector, createSelector} from '@ngrx/store';
import {CompanyState} from './company.reducer';
import * as fromCompany from './company.reducer';

export const selectCompanyState = createFeatureSelector<CompanyState>(
  fromCompany.companyFeatureKey,
);
export const selectFormJson = createSelector(selectCompanyState, state => state.formJson);
export const selectFormJsonByStep = (step: number) =>
  createSelector(selectCompanyState, state => state.formJson?.filter(item => item.step === step));
export const selectRequiredFields = createSelector(selectCompanyState, state =>
  state.formJson?.filter(
    field =>
      field.validators?.some(validator => validator.name === 'required') &&
      field.id !== 'password' &&
      field.id !== 'password_confirmation',
  ),
);
export const selectError = createSelector(selectCompanyState, state => state.error);
export const selectLoading = createSelector(selectCompanyState, state => state.loading);

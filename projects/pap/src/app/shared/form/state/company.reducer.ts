import {createReducer, on} from '@ngrx/store';
import {FormJson, Properties} from '../model';
import {
  loadCompaniesData,
  loadCompaniesDataFailure,
  loadCompaniesDataSuccess,
} from './company.actions';

export const companyFeatureKey = 'company';

export interface CompanyState {
  error?: string;
  formJson?: FormJson[];
  properties?: Properties;
  loading: boolean;
}

export const initialState: CompanyState = {
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(loadCompaniesData, state => ({
    ...state,
    loading: true,
  })),
  on(loadCompaniesDataSuccess, (state, {formJson, properties}) => ({
    ...state,
    formJson,
    properties,
    loading: false,
  })),
  on(loadCompaniesDataFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),
);

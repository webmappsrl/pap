import { createReducer, on } from "@ngrx/store";
import { FormJson } from "../model";
import { loadFormJson, loadFormJsonFailure, loadFormJsonSuccess } from "./company.actions";

export const companyFeatureKey = 'company';

export interface CompanyState {
  error?: string;
  formJson?: FormJson[];
  loading: boolean;
}

export const initialState: CompanyState = {
  loading: false,
};

export const reducer = createReducer(
  initialState,
  on(loadFormJson, state => ({
    ...state,
    loading: true,
  })),
  on(loadFormJsonSuccess, (state, {formJson}) => ({
    ...state,
    formJson,
    loading: false,
  })),
  on(loadFormJsonFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false,
  })),
)

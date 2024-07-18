import { createReducer, on } from "@ngrx/store";
import { FormJson } from "../model";
import { loadFormJson, loadFormJsonFailure, loadFormJsonSuccess } from "./form-fields.actions";

export const formJsonFeatureKey = 'formJson';

export interface FormJsonState {
  error?: string;
  formJson?: FormJson[];
  loading: boolean;
}

export const initialState: FormJsonState = {
  loading: false,
};

export const formJsonReducer = createReducer(
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

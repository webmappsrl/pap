import { createAction, props } from "@ngrx/store";
import { FormJson } from "../model";

export const loadFormJson = createAction('[FormJson] load form fields');

export const loadFormJsonSuccess = createAction(
  '[FormJson] load form fileds Success',
  props<{formJson: FormJson[]}>(),
);

export const loadFormJsonFailure = createAction(
  '[FormJson] load form fileds Failure',
  props<{error: string}>(),
);

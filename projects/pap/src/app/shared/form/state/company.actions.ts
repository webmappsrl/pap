import {createAction, props} from '@ngrx/store';
import {FormJson, Properties} from '../model';

export const loadCompaniesData = createAction('[Company] load companies data');

export const loadCompaniesDataSuccess = createAction(
  '[Company] load companies data Success',
  props<{formJson: FormJson[]; properties: Properties}>(),
);

export const loadCompaniesDataFailure = createAction(
  '[Company] load companies data Failure',
  props<{error: string}>(),
);

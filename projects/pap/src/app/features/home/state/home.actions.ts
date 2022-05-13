import { createAction, props } from '@ngrx/store';
import {buttonInfo} from '../../../models/buttonInfo';

export const yHomes = createAction(
  '[Home] Y Homes'
);

export const yHomesSuccess = createAction(
  '[Home] Y Homes Success',
  props<{buttons: buttonInfo[]}>(),
);

export const yHomesFailure = createAction('[Home] Y Homes Failure', props<{error: string}>());

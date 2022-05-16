import { createAction, props } from '@ngrx/store';
import {buttonInfo} from '../home.model';

export const yHomes = createAction(
  '[Home] Y Homes'
);

export const yHomesSuccess = createAction(
  '[Home] Y Homes Success',
  props<{buttons: buttonInfo[]}>(),
);

export const yHomesFailure = createAction('[Home] Y Homes Failure', props<{error: string}>());

import { createAction, props } from '@ngrx/store';

export const yHomes = createAction(
  '[Home] Y Homes'
);

export const yHomesSuccess = createAction(
  '[Home] Y Homes Success',
  props<{ data: any }>()
);

export const yHomesFailure = createAction(
  '[Home] Y Homes Failure',
  props<{ error: any }>()
);

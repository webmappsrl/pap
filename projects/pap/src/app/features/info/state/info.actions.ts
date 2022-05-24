import {createAction, props} from '@ngrx/store';

export const loadInfos = createAction('[Info] Load Infos');

export const loadInfosSuccess = createAction('[Info] Load Infos Success', props<{data: any}>());

export const loadInfosFailure = createAction('[Info] Load Infos Failure', props<{error: any}>());

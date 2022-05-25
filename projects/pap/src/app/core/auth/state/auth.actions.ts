import {createAction, props} from '@ngrx/store';
import {User} from '../auth.model';

export const loadAuths = createAction('[Auth] Load Auths');
export const loadAuthsSuccess = createAction('[Auth] Load Auths Success', props<{user: User}>());
export const loadAuthsFailure = createAction('[Auth] Load Auths Failure', props<{error: any}>());

export const loadSignIns = createAction('[Auth] Load SignIns', props<{credential: any}>());
export const loadSignInsSuccess = createAction('[Auth] Load SignIns Success', props<{user: any}>());
export const loadSignInsFailure = createAction(
  '[Auth] Load SignIns Failure',
  props<{error: any}>(),
);

export const loadSignUps = createAction('[Auth] Load SignUps', props<{credential: any}>());
export const loadSignUpsSuccess = createAction('[Auth] Load SignUps Success', props<{user: any}>());
export const loadSignUpsFailure = createAction(
  '[Auth] Load SignUps Failure',
  props<{error: any}>(),
);

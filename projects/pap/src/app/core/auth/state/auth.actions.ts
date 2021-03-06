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

export const UpdateUser = createAction(
  '[Auth] Update User',
  props<{updates: {[key: string]: any}}>(),
);
export const UpdateUserSuccess = createAction('[Auth] Update User Success', props<{user: any}>());
export const UpdateUserFailure = createAction('[Auth] Update User Failure', props<{error: any}>());

export const resendEmail = createAction('[Auth] Resend Email');
export const resendEmailSuccess = createAction('[Auth] Resend Email Success', props<{res: any}>());
export const resendEmailFailure = createAction(
  '[Auth] Resend Email Failure',
  props<{error: any}>(),
);
export const deleteUser = createAction('[Auth] Delete user');

export const logout = createAction('[Auth] logout');

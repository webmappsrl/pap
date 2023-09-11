import {createAction, props} from '@ngrx/store';

import {LoginCredentials, RegisterData, ResendEmailResponse, User} from '../auth.model';

export const loadAuths = createAction('[Auth] Load Auths');
export const loadAuthsSuccess = createAction('[Auth] Load Auths Success', props<{user: User}>());
export const loadAuthsFailure = createAction('[Auth] Load Auths Failure', props<{error: string}>());

export const loadSignIns = createAction(
  '[Auth] Load SignIns',
  props<{credential: LoginCredentials}>(),
);
export const loadSignInsSuccess = createAction(
  '[Auth] Load SignIns Success',
  props<{user: User}>(),
);
export const loadSignInsFailure = createAction(
  '[Auth] Load SignIns Failure',
  props<{error: string}>(),
);

export const loadSignUps = createAction('[Auth] Load SignUps', props<{data: RegisterData}>());
export const loadSignUpsSuccess = createAction(
  '[Auth] Load SignUps Success',
  props<{user: User}>(),
);
export const loadSignUpsFailure = createAction(
  '[Auth] Load SignUps Failure',
  props<{error: string}>(),
);

export const UpdateUser = createAction('[Auth] Update User', props<{updates: Partial<User>}>());
export const UpdateUserSuccess = createAction('[Auth] Update User Success', props<{user: User}>());
export const UpdateUserFailure = createAction(
  '[Auth] Update User Failure',
  props<{error: string}>(),
);

export const resendEmail = createAction('[Auth] Resend Email');
export const resendEmailSuccess = createAction(
  '[Auth] Resend Email Success',
  props<{res: ResendEmailResponse}>(),
);
export const resendEmailFailure = createAction(
  '[Auth] Resend Email Failure',
  props<{error: string}>(),
);
export const deleteUser = createAction('[Auth] Delete user');

export const logout = createAction('[Auth] logout');

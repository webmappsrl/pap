import {createAction, props} from '@ngrx/store';
import {User} from '../auth.model';

export const loadAuths = createAction('[Auth] Load Auths');

export const loadAuthsSuccess = createAction('[Auth] Load Auths Success', props<{user: User}>());

export const loadAuthsFailure = createAction('[Auth] Load Auths Failure', props<{error: any}>());

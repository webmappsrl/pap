import {createAction, props} from '@ngrx/store';

export const yLayouts = createAction('[Layout] YLayouts');

export const yLayoutsSuccess = createAction('[Layout] YLayouts Success', props<{scss: string}>());

export const yLayoutsFailure = createAction('[Layout] YLayouts Failure', props<{error: string}>());

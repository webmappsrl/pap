import {createAction, props} from '@ngrx/store';

export const loadMenu = createAction('[Menu] Load Menu');

export const loadMenuSuccess = createAction('[Menu] Load menu Success', props<{data: any}>());

export const loadMenuFailure = createAction('[Menu] Load menu Failure', props<{error: string}>());

export const openMenu = createAction('[Menu] Open Menu');

export const closeMenu = createAction('[Menu] Close Menu');

export const showButtons = createAction('[Menu] Show Buttons', props<{show: boolean}>());

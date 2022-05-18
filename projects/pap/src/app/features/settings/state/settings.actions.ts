import {createAction, props} from '@ngrx/store';

export const loadSettingss = createAction('[Settings] Load Settingss');

export const loadSettingssSuccess = createAction(
  '[Settings] Load Settingss Success',
  props<{data: any}>(),
);

export const loadSettingssFailure = createAction(
  '[Settings] Load Settingss Failure',
  props<{error: any}>(),
);

export const toggleEdit = createAction('[Settings] Toggle edit');

import {createAction, props} from '@ngrx/store';
import {SuccessResponse} from '../../../shared/form/model';

export const loadSettingss = createAction('[Settings] Load Settingss');

export const loadSettingssSuccess = createAction(
  '[Settings] Load Settingss Success',
  props<{data: SuccessResponse}>(),
);

export const loadSettingssFailure = createAction(
  '[Settings] Load Settingss Failure',
  props<{error: string}>(),
);

export const toggleEdit = createAction('[Settings] Toggle edit');

export const loadCalendarSettings = createAction('[Settings] Load Calendar Settings');

export const loadCalendarSettingsSuccess = createAction(
  '[Settings] Load Calendar Settings Success',
  props<{data: any}>(),
);

export const loadCalendarSettingsFailure = createAction(
  '[Settings] Load  Calenadar Settings Failure',
  props<{error: string}>(),
);

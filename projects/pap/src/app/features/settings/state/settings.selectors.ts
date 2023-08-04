import {createFeatureSelector, createSelector} from '@ngrx/store';
import {user} from '../../../core/auth/state/auth.selectors';
import * as fromSettings from './settings.reducer';

export const selectSettingsState = createFeatureSelector<fromSettings.SettingsState>(
  fromSettings.settingsFeatureKey,
);

export const settingView = createSelector(selectSettingsState, user, (settings, user) => {
  return {...settings, user};
});

export const calendarSettings = createSelector(
  selectSettingsState,
  state => state.calendarSettings,
);

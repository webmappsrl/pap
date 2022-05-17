import { Action, createReducer, on } from '@ngrx/store';
import * as SettingsActions from './settings.actions';

export const settingsFeatureKey = 'settings';

export interface State {

}

export const initialState: State = {

};

export const reducer = createReducer(
  initialState,

  on(SettingsActions.loadSettingss, state => state),
  on(SettingsActions.loadSettingssSuccess, (state, action) => state),
  on(SettingsActions.loadSettingssFailure, (state, action) => state),

);

import {state} from '@angular/animations';
import {Action, createReducer, on} from '@ngrx/store';
import * as SettingsActions from './settings.actions';

export const settingsFeatureKey = 'settings';

export interface SettingsState {
  editMode: boolean;
}

export const initialState: SettingsState = {
  editMode: false,
};

export const reducer = createReducer(
  initialState,

  on(SettingsActions.loadSettingss, state => state),
  on(SettingsActions.loadSettingssSuccess, (state, action) => state),
  on(SettingsActions.loadSettingssFailure, (state, action) => state),
  on(SettingsActions.toggleEdit, (state, action) => ({...state, editMode: !state.editMode})),
);

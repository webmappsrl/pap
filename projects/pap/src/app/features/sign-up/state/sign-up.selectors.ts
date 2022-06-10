import {createFeatureSelector, createSelector} from '@ngrx/store';
import {currentZone} from '../../../shared/map/state/map.selectors';
import * as fromSignUp from './sign-up.reducer';

export const selectSignUpState = createFeatureSelector<fromSignUp.State>(
  fromSignUp.signUpFeatureKey,
);
export const userTypes = createSelector(selectSignUpState, state => state.userTypes);
export const currentUserTypes = createSelector(userTypes, currentZone, (utypes, zone) => {
  if (utypes.length > 0 && zone != undefined) {
    const currentZoneUserTypeIDs: number[] = zone.properties.types;
    return utypes
      .filter(uType => currentZoneUserTypeIDs.indexOf(uType.id as number) > -1)
      .map(v => ({id: v.id, name: v.label}));
  }
  return [];
});

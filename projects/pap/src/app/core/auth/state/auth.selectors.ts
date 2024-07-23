import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromAuth from './auth.reducer';
import {Role} from '../auth.model';
import { selectRequiredFields } from '../../../shared/form/state/company.selectors';

export const selectAuthState = createFeatureSelector<fromAuth.AuthState>(fromAuth.authFeatureKey);
export const isLogged = createSelector(selectAuthState, state => state != null && state.isLogged);
export const isVerified = createSelector(
  selectAuthState,
  state =>
    state != null &&
    (state.isVerified || (state.user != null && state.user!.email_verified_at != null)),
);
export const noAddress = createSelector(selectAuthState, state => state != null && state.noAddress);
export const noHouseNumber = createSelector(selectAuthState, state =>
  state != null && state.noHouseNumber ? state.noHouseNumber : undefined,
);
export const user = createSelector(selectAuthState, state => {
  return state.user;
});
export const isVip = createSelector(user, user => {
  if (!user || !user.roles) {
    return false;
  }
  return user.roles.some((role: Role) => role.name === 'vip');
});
export const userRoles = createSelector(user, user => {
  return user?.roles.map(r => r.name) ?? ['contributor'];
});
export const isDustyMan = createSelector(user, user => {
  if (user == null) {
    return false;
  }
  const roles = user.roles;
  return roles.map((r: Role) => r.name).includes('dusty_man');
});
export const error = createSelector(selectAuthState, state => state != null && state.error);
export const missedUserFields = createSelector(user, selectRequiredFields, (user, requiredFields)=> {
  return !user ? [] : requiredFields?.filter((requiredField)=> {
    return (user as any)[requiredField?.id] === null;
  })??[];
})

import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromMenu from './menu.reducer';

export const selectMenuState = createFeatureSelector<fromMenu.MenuState>(fromMenu.headerFeatureKey);

import {createFeatureSelector} from '@ngrx/store';
import * as fromInfo from './info.reducer';

export const selectInfoState = createFeatureSelector<fromInfo.State>(fromInfo.infoFeatureKey);

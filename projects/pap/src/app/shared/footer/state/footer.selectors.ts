import {createFeatureSelector} from '@ngrx/store';
import * as fromFooter from './footer.reducer';

export const selectFooterState = createFeatureSelector<fromFooter.FooterState>(
  fromFooter.footerFeatureKey,
);

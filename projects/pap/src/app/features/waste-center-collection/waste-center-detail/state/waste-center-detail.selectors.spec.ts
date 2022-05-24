import * as fromWasteCenterDetail from './waste-center-detail.reducer';
import { selectWasteCenterDetailState } from './waste-center-detail.selectors';

describe('WasteCenterDetail Selectors', () => {
  it('should select the feature state', () => {
    const result = selectWasteCenterDetailState({
      [fromWasteCenterDetail.wasteCenterDetailFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

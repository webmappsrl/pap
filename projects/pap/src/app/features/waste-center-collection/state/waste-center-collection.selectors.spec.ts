import * as fromWasteCenterCollection from './waste-center-collection.reducer';
import { selectWasteCenterCollectionState } from './waste-center-collection.selectors';

describe('WasteCenterCollection Selectors', () => {
  it('should select the feature state', () => {
    const result = selectWasteCenterCollectionState({
      [fromWasteCenterCollection.wasteCenterCollectionFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

import * as fromMap from './map.reducer';
import { selectMapState } from './map.selectors';

describe('Map Selectors', () => {
  it('should select the feature state', () => {
    const result = selectMapState({
      [fromMap.mapFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

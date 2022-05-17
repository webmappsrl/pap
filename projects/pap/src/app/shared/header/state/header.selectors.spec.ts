import * as fromHeader from './header.reducer';
import { selectHeaderState } from './header.selectors';

describe('Header Selectors', () => {
  it('should select the feature state', () => {
    const result = selectHeaderState({
      [fromHeader.headerFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

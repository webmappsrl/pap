import * as fromInfo from './info.reducer';
import {selectInfoState} from './info.selectors';

describe('Info Selectors', () => {
  it('should select the feature state', () => {
    const result = selectInfoState({
      [fromInfo.infoFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
});

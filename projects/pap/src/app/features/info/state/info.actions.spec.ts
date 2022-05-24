import * as fromInfo from './info.actions';

describe('loadInfos', () => {
  it('should return an action', () => {
    expect(fromInfo.loadInfos().type).toBe('[Info] Load Infos');
  });
});

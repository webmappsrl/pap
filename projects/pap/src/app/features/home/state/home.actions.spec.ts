import * as fromHome from './home.actions';

describe('yHomes', () => {
  it('should return an action', () => {
    expect(fromHome.yHomes().type).toBe('[Home] Y Homes');
  });
});

import * as fromLayout from './layout.actions';

describe('yLayouts', () => {
  it('should return an action', () => {
    expect(fromLayout.yLayouts().type).toBe('[Layout] YLayouts');
  });
});

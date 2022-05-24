import * as fromWasteCenterDetail from './waste-center-detail.actions';

describe('loadWasteCenterDetails', () => {
  it('should return an action', () => {
    expect(fromWasteCenterDetail.loadWasteCenterDetails().type).toBe('[WasteCenterDetail] Load WasteCenterDetails');
  });
});

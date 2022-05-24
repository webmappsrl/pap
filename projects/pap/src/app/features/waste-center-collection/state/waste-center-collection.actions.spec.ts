import * as fromWasteCenterCollection from './waste-center-collection.actions';

describe('loadWasteCenterCollections', () => {
  it('should return an action', () => {
    expect(fromWasteCenterCollection.loadWasteCenterCollections().type).toBe('[WasteCenterCollection] Load WasteCenterCollections');
  });
});

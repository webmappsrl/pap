import * as fromTrashBookDetails from './trash-book-details.actions';

describe('loadTrashBookDetailss', () => {
  it('should return an action', () => {
    expect(fromTrashBookDetails.loadTrashBookDetailss().type).toBe('[TrashBookDetails] Load TrashBookDetailss');
  });
});

import * as fromTrashBook from './trash-book.actions';

describe('loadTrashBooks', () => {
  it('should return an action', () => {
    expect(fromTrashBook.loadTrashBooks().type).toBe('[TrashBook] Load TrashBooks');
  });
});

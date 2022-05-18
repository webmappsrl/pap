import * as fromTrashBook from './trash-book.reducer';
import {selectTrashBookState} from './trash-book.selectors';

describe('TrashBook Selectors', () => {
  it('should select the feature state', () => {
    const result = selectTrashBookState({
      [fromTrashBook.trashBookFeatureKey]: {},
    });

    expect(result).toEqual({});
  });
});

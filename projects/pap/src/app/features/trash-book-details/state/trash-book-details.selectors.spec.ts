import * as fromTrashBookDetails from './trash-book-details.reducer';
import { selectTrashBookDetailsState } from './trash-book-details.selectors';

describe('TrashBookDetails Selectors', () => {
  it('should select the feature state', () => {
    const result = selectTrashBookDetailsState({
      [fromTrashBookDetails.trashBookDetailsFeatureKey]: {}
    });

    expect(result).toEqual({});
  });
});

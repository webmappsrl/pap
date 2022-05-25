import * as fromForm from './form.actions';

describe('loadForms', () => {
  it('should return an action', () => {
    expect(fromForm.loadForms().type).toBe('[Form] Load Forms');
  });
});

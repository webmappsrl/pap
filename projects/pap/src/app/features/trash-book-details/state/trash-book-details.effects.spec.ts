import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { TrashBookDetailsEffects } from './trash-book-details.effects';

describe('TrashBookDetailsEffects', () => {
  let actions$: Observable<any>;
  let effects: TrashBookDetailsEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TrashBookDetailsEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(TrashBookDetailsEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable} from 'rxjs';

import {TrashBookEffects} from './trash-book.effects';

describe('TrashBookEffects', () => {
  let actions$: Observable<any>;
  let effects: TrashBookEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrashBookEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(TrashBookEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

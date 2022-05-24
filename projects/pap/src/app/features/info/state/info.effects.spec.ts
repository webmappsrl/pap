import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Observable} from 'rxjs';

import {InfoEffects} from './info.effects';

describe('InfoEffects', () => {
  let actions$: Observable<any>;
  let effects: InfoEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(InfoEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

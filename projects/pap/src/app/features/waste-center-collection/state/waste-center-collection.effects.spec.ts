import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { WasteCenterCollectionEffects } from './waste-center-collection.effects';

describe('WasteCenterCollectionEffects', () => {
  let actions$: Observable<any>;
  let effects: WasteCenterCollectionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WasteCenterCollectionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(WasteCenterCollectionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

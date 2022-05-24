import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { WasteCenterDetailEffects } from './waste-center-detail.effects';

describe('WasteCenterDetailEffects', () => {
  let actions$: Observable<any>;
  let effects: WasteCenterDetailEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WasteCenterDetailEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(WasteCenterDetailEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});

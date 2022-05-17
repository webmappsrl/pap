import { TestBed } from '@angular/core/testing';

import { TrashBookService } from './trash-book.service';

describe('TrashBookService', () => {
  let service: TrashBookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrashBookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

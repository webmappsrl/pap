import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrashBookComponent} from './trash-book.component';

describe('TrashBookComponent', () => {
  let component: TrashBookComponent;
  let fixture: ComponentFixture<TrashBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrashBookComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

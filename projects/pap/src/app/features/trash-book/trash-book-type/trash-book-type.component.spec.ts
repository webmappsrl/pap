import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TrashBookTypeComponent} from './trash-book-type.component';

describe('TrashBookTypeComponent', () => {
  let component: TrashBookTypeComponent;
  let fixture: ComponentFixture<TrashBookTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrashBookTypeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashBookTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

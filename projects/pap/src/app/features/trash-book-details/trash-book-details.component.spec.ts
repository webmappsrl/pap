import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrashBookDetailsComponent } from './trash-book-details.component';

describe('TrashBookDetailsComponent', () => {
  let component: TrashBookDetailsComponent;
  let fixture: ComponentFixture<TrashBookDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrashBookDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrashBookDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

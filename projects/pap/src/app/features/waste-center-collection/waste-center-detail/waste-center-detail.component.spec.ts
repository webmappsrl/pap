import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteCenterDetailComponent } from './waste-center-detail.component';

describe('WasteCenterDetailComponent', () => {
  let component: WasteCenterDetailComponent;
  let fixture: ComponentFixture<WasteCenterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteCenterDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteCenterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

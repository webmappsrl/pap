import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteCenterCollectionComponent } from './waste-center-collection.component';

describe('WasteCenterCollectionComponent', () => {
  let component: WasteCenterCollectionComponent;
  let fixture: ComponentFixture<WasteCenterCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WasteCenterCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WasteCenterCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

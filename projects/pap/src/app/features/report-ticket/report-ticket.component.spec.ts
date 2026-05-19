import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NavController} from '@ionic/angular';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {ReportTicketComponent} from './report-ticket.component';
import {loadCalendars} from '../calendar/state/calendar.actions';
import {selectCompanyProperties} from '../../shared/form/state/company.selectors';

// In this repo the global `expect` can be typed as Chai's Assertion in some tsconfigs.
// This local declaration forces Jasmine matchers in this spec file.
declare const expect: (actual: any) => jasmine.Matchers<any>;

describe('ReportTicketComponent', () => {
  let fixture: ComponentFixture<ReportTicketComponent>;
  let component: ReportTicketComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportTicketComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: NavController, useValue: {pop: () => undefined}},
        provideMockStore(),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReportTicketComponent);
    component = fixture.componentInstance;
  });

  it('should dispatch loadCalendars WITHOUT exclude_in_progress when property is false/undefined', () => {
    store.overrideSelector(selectCompanyProperties as any, {enableExludeInProgress: false});
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    expect(dispatchSpy).toHaveBeenCalled();
    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.type).toBe(loadCalendars.type);
    expect(action.prop.exclude_in_progress).not.toBeTrue();
  });

  it('should dispatch loadCalendars WITH exclude_in_progress when property is true', () => {
    store.overrideSelector(selectCompanyProperties as any, {enableExludeInProgress: true});
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.type).toBe(loadCalendars.type);
    expect(action.prop.exclude_in_progress).toBeTrue();
  });
});


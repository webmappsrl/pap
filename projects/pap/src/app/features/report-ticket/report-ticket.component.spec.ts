import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NavController} from '@ionic/angular';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {take} from 'rxjs/operators';
import {ReportTicketComponent} from './report-ticket.component';
import {loadCalendars} from '../calendar/state/calendar.actions';
import {selectCompanyProperties} from '../../shared/form/state/company.selectors';
import {selectTicketFormsConfigs} from '../../shared/form/state/form.selectors';
import {reportTicketForm, TicketFormConf} from '../../shared/models/form.model';

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

  afterEach(() => {
    store.resetSelectors();
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

  it('should expose form$ Observable that emits backend config when store has configs', () => {
    const backendConf: TicketFormConf = {...reportTicketForm, finalMessage: 'Backend report message'};
    // Override the base selector so all instances of selectTicketFormConfByType('report') react
    store.overrideSelector(selectTicketFormsConfigs as any, {report: backendConf});
    store.refreshState();

    let result: TicketFormConf | undefined;
    component.form$.pipe(take(1)).subscribe(conf => {
      result = conf;
    });

    expect(result).toBeDefined();
    expect(result!.finalMessage).toBe('Backend report message');
  });

  it('should fall back to hardcoded reportTicketForm when store has no configs', () => {
    store.overrideSelector(selectTicketFormsConfigs as any, null);
    store.refreshState();

    let result: TicketFormConf | undefined;
    component.form$.pipe(take(1)).subscribe(conf => {
      result = conf;
    });

    expect(result).toBeDefined();
    expect(result).toEqual(reportTicketForm);
  });
});


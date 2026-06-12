import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {NavController} from '@ionic/angular';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {take} from 'rxjs/operators';
import {ReportTicketComponent} from './report-ticket.component';
import {loadReportCalendars} from './state/report-calendar.actions';
import {selectCompanyProperties, selectLoading} from '../../shared/form/state/company.selectors';
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
      providers: [{provide: NavController, useValue: {pop: () => undefined}}, provideMockStore()],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(ReportTicketComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('dispatches loadReportCalendars without exclude_in_progress when flag is false', () => {
    store.overrideSelector(selectLoading as any, false);
    store.overrideSelector(selectCompanyProperties as any, {enableExludeInProgress: false});
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({type: loadReportCalendars.type}),
    );
    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.prop.exclude_in_progress).not.toBeTrue();
  });

  it('dispatches loadReportCalendars with exclude_in_progress when flag is true', () => {
    store.overrideSelector(selectLoading as any, false);
    store.overrideSelector(selectCompanyProperties as any, {enableExludeInProgress: true});
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.type).toBe(loadReportCalendars.type);
    expect(action.prop.exclude_in_progress).toBeTrue();
  });

  it('dispatches loadReportCalendars with exclude_in_progress false when properties undefined (API error fallback)', () => {
    store.overrideSelector(selectLoading as any, false);
    store.overrideSelector(selectCompanyProperties as any, undefined);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    expect(dispatchSpy).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({type: loadReportCalendars.type}),
    );
    const action = dispatchSpy.calls.mostRecent().args[0] as any;
    expect(action.prop.exclude_in_progress).toBeFalse();
  });

  it('does not dispatch while company data is loading', () => {
    store.overrideSelector(selectLoading as any, true);
    store.overrideSelector(selectCompanyProperties as any, undefined);
    const dispatchSpy = spyOn(store, 'dispatch');

    component.ionViewWillEnter();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('exposes form$ Observable that emits backend config when store has configs', () => {
    const backendConf: TicketFormConf = {
      ...reportTicketForm,
      finalMessage: 'Backend report message',
    };
    store.overrideSelector(selectTicketFormsConfigs as any, {report: backendConf});
    store.refreshState();

    let result: TicketFormConf | undefined;
    component.form$.pipe(take(1)).subscribe(conf => {
      result = conf;
    });

    expect(result).toBeDefined();
    expect(result!.finalMessage).toBe('Backend report message');
  });

  it('falls back to hardcoded reportTicketForm when store has no configs', () => {
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

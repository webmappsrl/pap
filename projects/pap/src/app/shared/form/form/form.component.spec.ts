import {TestBed, fakeAsync, tick} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {FormComponent} from './form.component';
import {TicketFormConf} from '../../models/form.model';
import {sendTicket} from '../state/form.actions';
import {selectCalendarState} from '../../../features/calendar/state/calendar.selectors';
import {selectReportCalendarState} from '../../../features/report-ticket/state/report-calendar.selectors';
import {trashBookTypes} from '../../../features/trash-book/state/trash-book.selectors';
import {confiniZone} from '../../map/state/map.selectors';
import {currentTrashBookType, ticketError, ticketLoading, ticketSuccess} from '../state/form.selectors';
import {user} from '../../../core/auth/state/auth.selectors';

declare const expect: (actual: any) => jasmine.Matchers<any>;

const noteStepConf: TicketFormConf = {
  cancel: '',
  finalMessage: '',
  pages: 1,
  ticketType: 'report',
  step: [{label: 'Note', type: 'note', required: false}],
};

const locationStepConf: TicketFormConf = {
  cancel: '',
  finalMessage: '',
  pages: 2,
  ticketType: 'reservation',
  step: [
    {label: 'Seleziona il luogo', type: 'location', required: true},
  ],
};

describe('FormComponent — location step', () => {
  let component: FormComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore(),
        {provide: NavController, useValue: {navigateRoot: () => undefined}},
        {
          provide: AlertController,
          useValue: {create: () => Promise.resolve({present: () => {}, onDidDismiss: () => of(null)})},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectCalendarState as any, null);
    store.overrideSelector(trashBookTypes as any, []);
    store.overrideSelector(confiniZone as any, []);
    store.overrideSelector(currentTrashBookType as any, undefined);
    store.overrideSelector(ticketError as any, null);
    store.overrideSelector(ticketLoading as any, false);
    store.overrideSelector(ticketSuccess as any, null);
    store.overrideSelector(user as any, null);

    const fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should add zone_id control when step type is location', () => {
    component.ticketFormConf = locationStepConf;
    expect(component.ticketForm.contains('zone_id')).toBeTrue();
  });

  it('should include zone_id in sendData dispatch payload', () => {
    component.ticketFormConf = locationStepConf;
    component.ticketForm.patchValue({
      location: [11.25, 43.77],
      address: 'Via Roma',
      city: 'Firenze',
      house_number: '5',
      address_id: '',
      zone_id: 42,
      ticket_type: 'reservation',
    });

    const dispatchSpy = spyOn(store, 'dispatch');
    component.sendData();

    expect(dispatchSpy).toHaveBeenCalled();
    const action = dispatchSpy.calls.mostRecent().args[0] as ReturnType<typeof sendTicket>;
    expect(action.type).toBe(sendTicket.type);
    expect((action as any).ticket.zone_id).toBe(42);
  });

  it('should NOT add zone_id control when step type is not location', () => {
    const noteConf: TicketFormConf = {
      ...locationStepConf,
      step: [{label: 'Note', type: 'note', required: false}],
    };
    component.ticketFormConf = noteConf;
    expect(component.ticketForm.contains('zone_id')).toBeFalse();
  });
});

describe('FormComponent — success alert message', () => {
  let component: FormComponent;
  let store: MockStore;
  let alertCreateSpy: jasmine.Spy;

  const setupStore = (store: MockStore, trashBookType: any = undefined) => {
    store.overrideSelector(selectCalendarState as any, null);
    store.overrideSelector(trashBookTypes as any, []);
    store.overrideSelector(confiniZone as any, []);
    store.overrideSelector(currentTrashBookType as any, trashBookType);
    store.overrideSelector(ticketError as any, null);
    store.overrideSelector(ticketLoading as any, false);
    store.overrideSelector(ticketSuccess as any, null);
    store.overrideSelector(user as any, null);
  };

  beforeEach(async () => {
    alertCreateSpy = jasmine.createSpy('create').and.returnValue(
      Promise.resolve({
        present: () => Promise.resolve(),
        onDidDismiss: () => of({role: 'close'}),
      }),
    );

    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore(),
        {provide: NavController, useValue: {navigateRoot: () => undefined}},
        {provide: AlertController, useValue: {create: alertCreateSpy}},
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    setupStore(store);

    const fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should include finalMessage from ticketFormConf in success alert', fakeAsync(() => {
    component.ticketFormConf = {
      cancel: '',
      finalMessage: 'Ci scusiamo per il disservizio.',
      pages: 1,
      ticketType: 'report',
      step: [],
    };

    store.overrideSelector(ticketSuccess as any, true);
    store.refreshState();
    tick(300); // flush Promise from alertCtrl.create + setTimeout(200) in close()

    expect(alertCreateSpy).toHaveBeenCalled();
    const msg: string = alertCreateSpy.calls.mostRecent().args[0].message;
    expect(msg).toContain('Ci scusiamo per il disservizio.');
  }));

  it('should always append the ticket section reference in success alert', fakeAsync(() => {
    component.ticketFormConf = {
      cancel: '',
      finalMessage: 'Qualsiasi messaggio.',
      pages: 1,
      ticketType: 'abandonment',
      step: [],
    };

    store.overrideSelector(ticketSuccess as any, true);
    store.refreshState();
    tick(300);

    const msg: string = alertCreateSpy.calls.mostRecent().args[0].message;
    expect(msg).toContain('Puoi visualizzare la segnalazione');
    expect(msg).toContain('i miei ticket');
  }));

  it('should append confirmation_message for reservation type when present', fakeAsync(() => {
    store.overrideSelector(currentTrashBookType as any, {
      id: 5,
      slug: 'raee',
      name: {it: 'RAEE'},
      confirmation_message: 'Assicurarsi che la strada sia larga.',
    });
    store.refreshState(); // update withLatestFrom cache before success fires

    component.ticketFormConf = {
      cancel: '',
      finalMessage: 'La sua segnalazione è stata presa in carico.',
      pages: 1,
      ticketType: 'reservation',
      step: [],
    };

    store.overrideSelector(ticketSuccess as any, true);
    store.refreshState();
    tick(300);

    const msg: string = alertCreateSpy.calls.mostRecent().args[0].message;
    expect(msg).toContain('La sua segnalazione è stata presa in carico.');
    expect(msg).toContain('Assicurarsi che la strada sia larga.');
  }));

  it('should use <br><br> (not newline) as separator between finalMessage and confirmation_message', fakeAsync(() => {
    store.overrideSelector(currentTrashBookType as any, {
      id: 5,
      slug: 'raee',
      name: {it: 'RAEE'},
      confirmation_message: 'Assicurarsi che la strada sia larga.',
    });
    store.refreshState();

    component.ticketFormConf = {
      cancel: '',
      finalMessage: 'La sua segnalazione è stata presa in carico.',
      pages: 1,
      ticketType: 'reservation',
      step: [],
    };

    store.overrideSelector(ticketSuccess as any, true);
    store.refreshState();
    tick(300);

    const msg: string = alertCreateSpy.calls.mostRecent().args[0].message;
    expect(msg).toContain('<br><br>Assicurarsi che la strada sia larga.');
    expect(msg).not.toContain('\n');
  }));

  it('should NOT append confirmation_message for non-reservation type', fakeAsync(() => {
    store.overrideSelector(currentTrashBookType as any, {
      id: 5,
      slug: 'test',
      name: {it: 'Test'},
      confirmation_message: 'QUESTO NON DEVE COMPARIRE',
    });
    store.refreshState();

    component.ticketFormConf = {
      cancel: '',
      finalMessage: 'Ci scusiamo per il disservizio.',
      pages: 1,
      ticketType: 'report',
      step: [],
    };

    store.overrideSelector(ticketSuccess as any, true);
    store.refreshState();
    tick(300);

    const msg: string = alertCreateSpy.calls.mostRecent().args[0].message;
    expect(msg).not.toContain('QUESTO NON DEVE COMPARIRE');
  }));

  // filter(v => v != null) passes false too, so false triggers the error-branch alert
  it('should show error alert (not success) when ticketSuccess is false', fakeAsync(() => {
    component.ticketFormConf = locationStepConf;

    store.overrideSelector(ticketSuccess as any, false);
    store.refreshState();
    tick(300);

    expect(alertCreateSpy).toHaveBeenCalled();
    const args = alertCreateSpy.calls.mostRecent().args[0];
    expect(args.cssClass).toContain('error');
    expect(args.message).toContain('Errore');
  }));
});

describe('FormComponent — calendars$ selector routing', () => {
  let component: FormComponent;
  let store: MockStore;

  const pastCalendars = [{address: {id: 1} as any, calendar: {'2026-06-01': []}} as any];
  const futureCalendars = [{address: {id: 2} as any, calendar: {'2026-08-15': []}} as any];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore(),
        {provide: NavController, useValue: {navigateRoot: () => undefined}},
        {
          provide: AlertController,
          useValue: {create: () => Promise.resolve({present: () => {}, onDidDismiss: () => of(null)})},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectCalendarState as any, {calendars: futureCalendars});
    store.overrideSelector(selectReportCalendarState as any, {calendars: pastCalendars, loading: false, error: ''});
    store.overrideSelector(trashBookTypes as any, []);
    store.overrideSelector(confiniZone as any, []);
    store.overrideSelector(currentTrashBookType as any, undefined);
    store.overrideSelector(ticketError as any, null);
    store.overrideSelector(ticketLoading as any, false);
    store.overrideSelector(ticketSuccess as any, null);
    store.overrideSelector(user as any, null);

    const fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => store.resetSelectors());

  it('should read from selectReportCalendarState (date passate) when ticketType is report', (done) => {
    component.ticketFormConf = {
      cancel: '',
      finalMessage: '',
      pages: 1,
      ticketType: 'report',
      step: [{label: 'Tipo', type: 'calendar_trash_type_id', required: true}],
    };

    component.calendars$.pipe(take(1)).subscribe(cals => {
      expect(cals).toEqual(pastCalendars);
      done();
    });
  });

  it('should read from selectCalendarState (date future) when ticketType is reservation', (done) => {
    component.ticketFormConf = {
      cancel: '',
      finalMessage: '',
      pages: 1,
      ticketType: 'reservation',
      step: [{label: 'Tipo', type: 'calendar_trash_type_id', required: true}],
    };

    component.calendars$.pipe(take(1)).subscribe(cals => {
      expect(cals).toEqual(futureCalendars);
      done();
    });
  });

  it('should NOT show future dates when ticketType is report', (done) => {
    component.ticketFormConf = {
      cancel: '',
      finalMessage: '',
      pages: 1,
      ticketType: 'report',
      step: [{label: 'Tipo', type: 'calendar_trash_type_id', required: true}],
    };

    component.calendars$.pipe(take(1)).subscribe(cals => {
      expect(cals).not.toEqual(futureCalendars);
      done();
    });
  });
});

describe('FormComponent — ticketFormConf setter idempotency', () => {
  let component: FormComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormComponent],
      imports: [ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore(),
        {provide: NavController, useValue: {navigateRoot: () => undefined}},
        {
          provide: AlertController,
          useValue: {create: () => Promise.resolve({present: () => {}, onDidDismiss: () => of(null)})},
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectCalendarState as any, null);
    store.overrideSelector(trashBookTypes as any, []);
    store.overrideSelector(confiniZone as any, []);
    store.overrideSelector(currentTrashBookType as any, undefined);
    store.overrideSelector(ticketError as any, null);
    store.overrideSelector(ticketLoading as any, false);
    store.overrideSelector(ticketSuccess as any, null);
    store.overrideSelector(user as any, null);

    const fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should not duplicate controls when ticketFormConf is set twice with the same config', () => {
    component.ticketFormConf = noteStepConf;
    component.ticketFormConf = noteStepConf;
    expect(component.ticketForm.contains('note')).toBeTrue();
    expect(Object.keys(component.ticketForm.controls).filter(k => k === 'note').length).toBe(1);
  });

  it('should reset form controls when ticketFormConf is set a second time', () => {
    const confA: TicketFormConf = {...noteStepConf, step: [{label: 'Note', type: 'note', required: false}]};
    const confB: TicketFormConf = {...noteStepConf, step: [{label: 'Telefono', type: 'phone', required: true}]};
    component.ticketFormConf = confA;
    component.ticketFormConf = confB;
    expect(component.ticketForm.contains('phone')).toBeTrue();
    expect(component.ticketForm.contains('note')).toBeFalse();
  });
});

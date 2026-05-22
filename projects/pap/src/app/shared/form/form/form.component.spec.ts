import {TestBed} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {AlertController, NavController} from '@ionic/angular';
import {of} from 'rxjs';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {FormComponent} from './form.component';
import {TicketFormConf} from '../../models/form.model';
import {sendTicket} from '../state/form.actions';
import {selectCalendarState} from '../../../features/calendar/state/calendar.selectors';
import {trashBookTypes} from '../../../features/trash-book/state/trash-book.selectors';
import {confiniZone} from '../../map/state/map.selectors';
import {currentTrashBookType, ticketError, ticketLoading, ticketSuccess} from '../state/form.selectors';
import {user} from '../../../core/auth/state/auth.selectors';

declare const expect: (actual: any) => jasmine.Matchers<any>;

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

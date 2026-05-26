import {reducer, initialState} from './form.reducer';
import {
  loadTicketFormsConfigSuccess,
  loadTicketFormsConfigFailure,
} from './form.actions';
import {TicketFormConf} from '../../models/form.model';

declare const expect: (actual: any) => jasmine.Matchers<any>;

const minimalConf = (finalMessage: string): TicketFormConf => ({
  cancel: '',
  finalMessage,
  pages: 1,
  ticketType: 'abandonment',
  step: [],
});

describe('Form reducer — ticket forms config', () => {
  it('should have ticketFormsConfigs null and loaded false in initial state', () => {
    expect(initialState.ticketFormsConfigs).toBeNull();
    expect(initialState.ticketFormsConfigsLoaded).toBeFalse();
  });

  it('should store configs and set loaded true on loadTicketFormsConfigSuccess', () => {
    const configs = {abandonment: minimalConf('Backend message')};
    const state = reducer(initialState, loadTicketFormsConfigSuccess({configs}));

    expect(state.ticketFormsConfigs).toEqual(configs);
    expect(state.ticketFormsConfigsLoaded).toBeTrue();
  });

  it('should keep other state untouched on loadTicketFormsConfigSuccess', () => {
    const configs = {report: minimalConf('Report message')};
    const state = reducer({...initialState, loading: true}, loadTicketFormsConfigSuccess({configs}));

    expect(state.loading).toBeTrue();
  });

  it('should set only loaded true on loadTicketFormsConfigFailure, keeping configs null', () => {
    const state = reducer(initialState, loadTicketFormsConfigFailure({err: 'Network error'}));

    expect(state.ticketFormsConfigs).toBeNull();
    expect(state.ticketFormsConfigsLoaded).toBeTrue();
  });

  it('should overwrite existing configs on a second loadTicketFormsConfigSuccess', () => {
    const first = reducer(
      initialState,
      loadTicketFormsConfigSuccess({configs: {abandonment: minimalConf('v1')}}),
    );
    const second = reducer(
      first,
      loadTicketFormsConfigSuccess({configs: {abandonment: minimalConf('v2')}}),
    );

    expect((second.ticketFormsConfigs as any)['abandonment'].finalMessage).toBe('v2');
  });
});

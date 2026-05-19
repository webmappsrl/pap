import {reducer, initialState, CompanyState} from './company.reducer';
import {
  loadCompaniesData,
  loadCompaniesDataFailure,
  loadCompaniesDataSuccess,
} from './company.actions';
import {FormJson, Properties} from '../model';

describe('Company reducer', () => {
  it('should set loading true on loadCompaniesData', () => {
    const state = reducer(initialState, loadCompaniesData());
    expect(state.loading).toBeTrue();
  });

  it('should store formJson + properties and set loading false on success', () => {
    const formJson: FormJson[] = [{name: 'field1', step: 1, type: 'text'}];
    const properties: Properties = {enableExludeInProgress: true};

    const state = reducer(
      {...initialState, loading: true} as CompanyState,
      loadCompaniesDataSuccess({formJson, properties}),
    );

    expect(state.loading).toBeFalse();
    expect(state.formJson).toEqual(formJson);
    expect(state.properties).toEqual(properties);
  });

  it('should store error and set loading false on failure', () => {
    const state = reducer(
      {...initialState, loading: true},
      loadCompaniesDataFailure({error: 'boom'}),
    );

    expect(state.loading).toBeFalse();
    expect(state.error).toBe('boom');
  });
});


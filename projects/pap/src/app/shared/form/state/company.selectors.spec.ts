import {selectCompanyProperties, selectFormJsonByStep, selectLoading} from './company.selectors';
import {CompanyState} from './company.reducer';
import {FormJson, Properties} from '../model';

// In this repo the global `expect` can be typed as Chai's Assertion in some tsconfigs.
// This local declaration forces Jasmine matchers in this spec file.
declare const expect: (actual: any) => jasmine.Matchers<any>;

describe('Company selectors', () => {
  beforeEach(() => {
    (selectCompanyProperties as any).clearResult();
  });

  it('selectCompanyProperties should return properties', () => {
    const properties: Properties = {enableExludeInProgress: true};
    const companyState: CompanyState = {loading: false, properties};
    const rootState = {company: companyState};

    expect(selectCompanyProperties(rootState as any)).toEqual(properties);
  });

  it('selectFormJsonByStep should filter by step', () => {
    const formJson: FormJson[] = [
      {name: 'a', step: 1, type: 'text'},
      {name: 'b', step: 2, type: 'text'},
    ];
    const companyState: CompanyState = {loading: false, formJson};
    const rootState = {company: companyState};

    const selector = selectFormJsonByStep(2);
    expect(selector(rootState as any)).toEqual([{name: 'b', step: 2, type: 'text'}]);
  });

  it('selectLoading should return loading', () => {
    const companyState: CompanyState = {loading: false};
    const rootState = {company: companyState};

    expect(selectLoading(rootState as any)).toBeFalse();
  });
});

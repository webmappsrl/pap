import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CompanyService} from './company.service';
import {environment as env} from 'projects/pap/src/environments/environment';
import {SuccessData} from '../model';

describe('CompanyService', () => {
  let service: CompanyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CompanyService],
    });

    service = TestBed.inject(CompanyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getCompaniesData should map form_json + properties', done => {
    service.getCompaniesData().subscribe(r => {
      expect(r.formJson.length).toBe(1);
      expect(r.formJson[0].name).toBe('x');
      expect(r.properties.enableExludeInProgress).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(
      `${env.api}/c/${env.companyId}/companies_data?id=${env.companyId}`,
    );
    expect(req.request.method).toBe('GET');

    const body: SuccessData<any> = {
      data: {
        form_json: [{name: 'x', step: 1, type: 'text'}],
        properties: {enableExludeInProgress: true},
      },
      message: 'ok',
    };
    req.flush(body);
  });

  it('getCompaniesData should normalize array/null properties to {}', done => {
    service.getCompaniesData().subscribe(r => {
      expect(r.properties).toEqual({});
      done();
    });

    const req = httpMock.expectOne(
      `${env.api}/c/${env.companyId}/companies_data?id=${env.companyId}`,
    );
    req.flush({
      data: {form_json: [], properties: []},
      message: 'ok',
    });
  });
});


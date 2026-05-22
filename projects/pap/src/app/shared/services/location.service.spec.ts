import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {LocationService} from './location.service';

declare const expect: (actual: any) => jasmine.Matchers<any>;

describe('LocationService.getAddress', () => {
  let service: LocationService;
  let httpMock: HttpTestingController;
  const coords = [11.25, 43.77];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationService],
    });
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should map road to address and house_number to house_number', done => {
    service.getAddress(coords).subscribe(result => {
      expect(result.address).toBe('Via Roma');
      expect(result.house_number).toBe('12');
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('nominatim'));
    req.flush({address: {road: 'Via Roma', house_number: '12', municipality: 'Firenze'}});
  });

  it('should always return empty city regardless of Nominatim response', done => {
    service.getAddress(coords).subscribe(result => {
      expect(result.city).toBe('');
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('nominatim'));
    req.flush({address: {road: 'Via Dante', municipality: 'Pisa', county: 'PI'}});
  });

  it('should return empty strings when road and house_number are absent', done => {
    service.getAddress(coords).subscribe(result => {
      expect(result.address).toBe('');
      expect(result.house_number).toBe('');
      expect(result.city).toBe('');
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('nominatim'));
    req.flush({address: {}});
  });

  it('should handle missing address object', done => {
    service.getAddress(coords).subscribe(result => {
      expect(result.address).toBe('');
      expect(result.house_number).toBe('');
      expect(result.city).toBe('');
      done();
    });

    const req = httpMock.expectOne(r => r.url.includes('nominatim'));
    req.flush({});
  });
});

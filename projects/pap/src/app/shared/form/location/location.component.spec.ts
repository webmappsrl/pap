import {TestBed} from '@angular/core/testing';
import {FormControl, FormGroup} from '@angular/forms';
import {provideMockStore, MockStore} from '@ngrx/store/testing';
import {of} from 'rxjs';
import {LocationComponent} from './location.component';
import {LocationService} from '../../services/location.service';
import {currentZone} from '../../map/state/map.selectors';

declare const expect: (actual: any) => jasmine.Matchers<any>;

const mockZone = {
  type: 'Feature',
  geometry: {coordinates: [], type: 'MultiPolygon'},
  properties: {id: 42, comune: 'Firenze', availableUserTypes: [], types: [], url: ''},
};

function buildParentForm(): FormGroup {
  return new FormGroup({
    location: new FormControl(''),
    address: new FormControl(''),
    city: new FormControl(''),
    house_number: new FormControl(''),
    address_id: new FormControl(''),
    zone_id: new FormControl(''),
  });
}

describe('LocationComponent', () => {
  let component: LocationComponent;
  let store: MockStore;
  let locationSpy: jasmine.SpyObj<LocationService>;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [provideMockStore()]});
    store = TestBed.inject(MockStore);
    store.overrideSelector(currentZone as any, mockZone);
    store.refreshState();

    locationSpy = jasmine.createSpyObj('LocationService', ['getAddress']);
    locationSpy.getAddress.and.returnValue(
      of({address: 'Via Roma', house_number: '5', city: ''}),
    );

    component = new LocationComponent(locationSpy, store as any, {detectChanges: () => {}} as any);
    component.form = buildParentForm();
  });

  describe('setPosition() con zona valida', () => {
    it('should set city from zone.properties.comune', () => {
      component.setPosition([11.25, 43.77]);
      expect(component.form.get('city')!.value).toBe('Firenze');
    });

    it('should set zone_id from zone.properties.id', () => {
      component.setPosition([11.25, 43.77]);
      expect(component.form.get('zone_id')!.value).toBe(42);
    });

    it('should not overwrite city with the empty string from Nominatim', () => {
      component.setPosition([11.25, 43.77]);
      expect(component.form.get('city')!.value).not.toBe('');
    });
  });

  describe('setPosition() senza zona', () => {
    beforeEach(() => {
      store.overrideSelector(currentZone as any, undefined);
      store.refreshState();
    });

    it('should mark location control as invalid when zone is null', () => {
      component.setPosition([0, 0]);
      expect(component.form.get('location')!.invalid).toBeTrue();
    });

    it('should not set zone_id when zone is null', () => {
      component.setPosition([0, 0]);
      expect(component.form.get('zone_id')!.value).toBeFalsy();
    });
  });

  describe('setAddress() con indirizzo salvato', () => {
    it('should set zone_id from address.zone_id', () => {
      component.setAddress({address: 'Via Verdi', city: 'Firenze', house_number: '3', id: 10, zone_id: 99});
      expect(component.form.get('zone_id')!.value).toBe(99);
    });

    it('should not overwrite zone_id when address.zone_id is absent', () => {
      component.form.get('zone_id')!.setValue(42);
      component.setAddress({address: 'Via Verdi', city: 'Firenze'});
      expect(component.form.get('zone_id')!.value).toBe(42);
    });
  });

  describe('setAddress() con "altro"', () => {
    it('should reset zone_id', () => {
      component.form.get('zone_id')!.setValue(42);
      component.setAddress({address: 'altro'});
      expect(component.form.get('zone_id')!.value).toBeNull();
    });
  });
});

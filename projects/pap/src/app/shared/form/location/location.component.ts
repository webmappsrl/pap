import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {AppState} from '../../../core/core.state';
import {setMarker} from '../../map/state/map.actions';
import {currentZone} from '../../map/state/map.selectors';
import {LocationService} from '../../services/location.service';
import {AddressEvent, GeoJsonFeatureCollection, Zone} from './location.model';

@Component({
  selector: 'pap-form-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class LocationComponent {
  @Input() set position(coords: [number, number]) {
    if (coords != null && coords.length > 0) {
      this.myPosition$.next(coords);
      this._store.dispatch(setMarker({coords}));
    }
  }
  @Input() features: GeoJsonFeatureCollection[];
  @Input() form: FormGroup;
  @Output() addressEVT: EventEmitter<AddressEvent> = new EventEmitter<AddressEvent>();

  currentZone$: Observable<Zone> = this._store.select(currentZone);
  myPosition$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  formAddress: FormGroup;
  constructor(
    private locationService: LocationService,
    private _store: Store<AppState>,
    private _cdr: ChangeDetectorRef,
  ) {
    this.formAddress = new FormGroup({
      city: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      house_number: new FormControl('', Validators.required),
    });
    this.formAddress.valueChanges.subscribe(addr => {
      console.log(addr);
      this.addressEVT.emit({
        location: this.myPosition$.value,
        address: addr.address,
        city: addr.city,
        house_number: addr.house_number,
      });
    });
  }

  set address(addr: any) {
    this.addressEVT.emit({
      location: this.myPosition$.value,
      address: addr.address,
      city: addr.city,
    });
    this.setAddress(addr);
  }

  async getLocation(): Promise<void> {
    try {
      navigator.geolocation.getCurrentPosition(location => {
        const coords = [location.coords.longitude, location.coords.latitude] as [number, number];
        this._store.dispatch(setMarker({coords}));
      });
    } catch (error) {
      console.error(error);
    }
  }

  mapClick(ev: number[]): void {
    this.setPosition(ev);
  }

  setAddress(address: any): void {
    if (address.address != null && address.address != '') {
      this.formAddress.patchValue({
        address: address.address,
      });
    }
    if (address.city != null && address.city != '') {
      this.formAddress.patchValue({
        city: address.city,
      });
    }
    if (address.house_number != null && address.house_number != '') {
      this.formAddress.patchValue({
        house_number: address.house_number,
      });
    }
    this.form.get('location_address')?.setValue(address);
    this._cdr.detectChanges();
  }

  setPosition(coords: number[]): void {
    this.myPosition$.next(coords);
    this.form.get('location')?.setValue(coords);
    this.locationService.getAddress(coords).subscribe(
      res => {
        this.setAddress(res as string);
      },
      (error: string) => {
        const res = `${coords[0]} ${coords[1]}`;
        this.setAddress(res);
      },
    );
    this.currentZone$.pipe(take(1)).subscribe(zone => {
      if (zone == null) {
        this.form.get('location')!.setErrors({'incorrect': true});
      }
    });
  }
}

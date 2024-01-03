import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {take} from 'rxjs/operators';
import {AppState} from '../../../core/core.state';
import {setMarker} from '../../map/state/map.actions';
import {currentZone} from '../../map/state/map.selectors';
import {LocationService} from '../../services/location.service';
import {AddressEvent, GeoJsonFeatureCollection, Zone} from './location.model';
import {user} from '../../../core/auth/state/auth.selectors';

@Component({
  selector: 'pap-form-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LocationComponent,
    },
  ],
})
export class LocationComponent implements OnDestroy, ControlValueAccessor {
  private _formAddressValueChangesSub: Subscription = Subscription.EMPTY;

  @Input() set position(coords: [number, number]) {
    if (coords != null && coords.length > 0) {
      this.myPosition$.next(coords);
      this._store.dispatch(setMarker({coords}));
    }
  }

  set address(addr: any) {
    this.addressEVT.emit({
      location: this.myPosition$.value,
      address: addr.address,
      city: addr.city,
    });
    this.setAddress(addr);
  }

  @Input() features: GeoJsonFeatureCollection[];
  @Input() form: FormGroup;
  @Input() userAddress = false;
  @Output() addressEVT: EventEmitter<AddressEvent> = new EventEmitter<AddressEvent>();

  currentAddressIdx$: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  currentZone$: Observable<Zone> = this._store.select(currentZone);
  formAddress: FormGroup;
  myPosition$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  onChange = (image: string) => {};
  onTouched = () => {};
  touched = false;
  user$ = this._store.pipe(select(user));

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
    this._formAddressValueChangesSub = this.formAddress.valueChanges.subscribe(addr => {
      this.addressEVT.emit({
        location: this.myPosition$.value,
        address: addr.address,
        city: addr.city,
        house_number: addr.house_number,
      });
      if (this.form != null) {
        this.form.patchValue({
          location: this.myPosition$.value,
          address: addr.address,
          city: addr.city,
          house_number: addr.house_number,
        });
      }
    });
  }

  async getLocation(): Promise<void> {
    try {
      navigator.geolocation.getCurrentPosition(location => {
        const coords = [location.coords.longitude, location.coords.latitude] as [number, number];
        this.setPosition(coords);
        this._store.dispatch(setMarker({coords}));
      });
    } catch (error) {
      console.error(error);
    }
  }

  mapClick(coords: number[]): void {
    this.setPosition(coords);
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  ngOnDestroy(): void {
    this._formAddressValueChangesSub.unsubscribe();
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  setAddress(address: any): void {
    console.log(address);
    if (address.address != null && address.address === 'altro') {
      this.form.get('address')?.reset();
      this.form.get('city')?.reset();
      this.form.get('house_number')?.reset();
      this.form.get('location')?.reset();
      this.formAddress.reset();
    } else {
      if (address.address != null && address.address != '') {
        this.formAddress.patchValue({
          address: address.address,
        });
        this.form.get('address')?.setValue(address.address);
      }
      if (address.city != null && address.city != '') {
        this.formAddress.patchValue({
          city: address.city,
        });
        this.form.get('city')?.setValue(address.city);
      }
      if (address.house_number != null && address.house_number != '') {
        this.formAddress.patchValue({
          house_number: address.house_number,
        });
        this.form.get('house_number')?.setValue(address.house_number);
      }
      if (address.location != null && address.location != '') {
        this.formAddress.patchValue({
          location: address.location,
        });
        this.form.get('location')?.setValue(address.location);
      }
    }

    this._cdr.detectChanges();
  }

  setPosition(coords: number[]): void {
    this.myPosition$.next(coords);
    this.form.get('location')?.setValue(coords);
    this.locationService
      .getAddress(coords)
      .pipe(take(1))
      .subscribe(
        res => {
          this.setAddress(res);
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

  writeValue(image: string): void {
    this.onChange(image);
  }
}

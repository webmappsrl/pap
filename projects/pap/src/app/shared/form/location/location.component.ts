import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
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
export class LocationComponent implements OnDestroy {
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
  @Output() addressEVT: EventEmitter<AddressEvent> = new EventEmitter<AddressEvent>();

  currentZone$: Observable<Zone> = this._store.select(currentZone);
  formAddress: FormGroup;
  myPosition$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

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

  ngOnDestroy(): void {
    this._formAddressValueChangesSub.unsubscribe();
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
    this.form.get('address')?.setValue(address.address);
    this.form.get('city')?.setValue(address.city);
    this.form.get('house_number')?.setValue(address.house_number);
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

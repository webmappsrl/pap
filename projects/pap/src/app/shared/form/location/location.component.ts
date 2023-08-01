import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Store, select} from '@ngrx/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {AppState} from '../../../core/core.state';
import {setMarker} from '../../map/state/map.actions';
import {currentAddress} from '../../map/state/map.selectors';
import {LocationService} from '../../services/location.service';

@Component({
  selector: 'pap-form-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LocationComponent,
    },
  ],
})
export class LocationComponent implements ControlValueAccessor {
  currentAddress$: Observable<string | undefined> = this._store.pipe(select(currentAddress));
  disabled = false;
  myPosition$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public myPositionString: string = '';
  onChange = (location: number) => {};
  onTouched = () => {};
  touched = false;
  @Output() addressEVT: EventEmitter<any> = new EventEmitter<any>();
  constructor(private locationService: LocationService, private _store: Store<AppState>) {}

  addressOnChange(event: any) {
    if (event?.target && typeof event.target.value === 'string') {
      this.setAddress(event.target.value);
    }
  }

  async getLocation() {
    try {
      navigator.geolocation.getCurrentPosition(location => {
        const coords = [location.coords.latitude, location.coords.longitude] as [number, number];
        this._store.dispatch(setMarker({coords}));
        this.writeValue(coords);
      });
    } catch (error) {
      console.error(error);
    }
  }

  mapClick(ev: number[]) {
    this.setPosition(ev);
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  setAddress(address: string) {
    this.myPositionString = address;
  }

  setPosition(coords: number[]) {
    this.writeValue(coords);
    this.myPosition$.next(coords);
    this.locationService.getAddress(coords).subscribe(
      res => {
        this.setAddress(res as string);
      },
      (error: any) => {
        this.setAddress(`${coords[0]} ${coords[1]}`);
      },
    );
  }

  writeValue(coords: any): void {
    this.myPosition$.next(coords);
    this._store.dispatch(setMarker({coords}));
    this.onChange(coords);
    this.addressEVT.emit({
      location: coords,
      address: this.myPositionString,
    });
  }
}

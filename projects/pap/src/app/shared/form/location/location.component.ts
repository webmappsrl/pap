import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AppState} from '@capacitor/app';
import {select, Store} from '@ngrx/store';
import {Observable} from 'rxjs';
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
  public myPosition: number[] = [];
  public myPositionString: string = '';
  onChange = (location: number) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  location: [number, number] | [] = [];
  currentAddress$: Observable<string | undefined> = this._store.pipe(select(currentAddress));
  constructor(private locationService: LocationService, private _store: Store<AppState>) {}
  writeValue(coords: any): void {
    this.location = coords;
    this.onChange(coords);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setAddress(address: string) {
    this.myPositionString = address;
  }

  addressOnChange(event: any) {
    if (event?.target && typeof event.target.value === 'string') {
      this.setAddress(event.target.value);
    }
  }
  mapClick(ev: number[]) {
    this.setPosition(ev);
  }

  setPosition(coords: number[]) {
    this.writeValue(coords);
    if (this.locationService.isInsideMap(coords)) {
      this.myPosition = coords;
      this.locationService.getAddress(coords).subscribe(
        res => {
          this.setAddress(res as string);
        },
        (error: any) => {
          this.setAddress(`${coords[0]} ${coords[1]}`);
        },
      );
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
}

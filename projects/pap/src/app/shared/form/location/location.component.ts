import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Store} from '@ngrx/store';
import {BehaviorSubject, Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {AppState} from '../../../core/core.state';
import {setMarker} from '../../map/state/map.actions';
import {currentZone} from '../../map/state/map.selectors';
import {LocationService} from '../../services/location.service';

@Component({
  selector: 'pap-form-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LocationComponent {
  @Input() set position(coords: [number, number]) {
    if (coords != null && coords.length > 0) {
      this.myPosition$.next(coords);
      this._store.dispatch(setMarker({coords}));
    }
  }

  get address() {
    return this.myPositionString;
  }

  set address(addr: string) {
    this.addressEVT.emit({
      location: this.myPosition$.value,
      address: addr,
    });
    this.setAddress(addr);
  }

  @Input() features: any[];
  @Input() form: FormGroup;
  @Output() addressEVT: EventEmitter<any> = new EventEmitter<any>();

  currentZone$: Observable<any> = this._store.select(currentZone);
  myPosition$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  myPositionString: string = '';

  constructor(
    private locationService: LocationService,
    private _store: Store<AppState>,
    private _cdr: ChangeDetectorRef,
  ) {}

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

  setAddress(address: string): void {
    this.myPositionString = address;
    this.form.get('location_address')?.setValue(address);
    this._cdr.detectChanges();
  }

  setPosition(coords: number[]): void {
    this.myPosition$.next(coords);
    this.form.get('location')?.setValue(coords);
    this.locationService.getAddress(coords).subscribe(
      res => {
        this.setAddress(res as string);
        this.addressEVT.emit({
          location: coords,
          address: res,
        });
      },
      (error: any) => {
        const res = `${coords[0]} ${coords[1]}`;
        this.setAddress(res);
        this.addressEVT.emit({
          location: coords,
          address: res,
        });
      },
    );
    this.currentZone$.pipe(take(1)).subscribe(zone => {
      if (zone == null) {
        this.form.get('location')!.setErrors({'incorrect': true});
      }
    });
  }
}

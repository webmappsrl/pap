import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'pap-form-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LocationComponent {
  @Output() positionSet = new EventEmitter();

  public myPosition: number[] = [];
  public myPositionString: string = '';

  addressOnChange(event: any) {
    if (event?.target && typeof event.target.value === 'string') {
      let address: string = event.target.value;
      this.myPositionString = address;
      this.positionSet.emit(this.myPositionString);
    }
  }

  mapClick(ev: number[]) {
    this.myPosition = ev;
    this.myPositionString = `${ev[0]} ${ev[1]}`;
  }

  getLocation(): void {
    // this.map.locate();
    // this.geolocation
    //   .getCurrentPosition()
    //   .then((resp) => {
    //     if (
    //       resp.coords.latitude >= MAP.bounds.southWest.lat &&
    //       resp.coords.latitude <= MAP.bounds.northEast.lat &&
    //       resp.coords.longitude >= MAP.bounds.southWest.lng &&
    //       resp.coords.longitude <= MAP.bounds.northEast.lng
    //     ) {
    //       this.coordinates =
    //         "lat: " +
    //         resp.coords.latitude +
    //         `
    //     lng: ` +
    //         resp.coords.longitude;
    //       this.positionSet.emit([resp.coords.latitude, resp.coords.longitude]);
    //       if (this.marker) this.map.removeLayer(this.marker);
    //       this.marker = L.marker([
    //         resp.coords.latitude,
    //         resp.coords.longitude,
    //       ]).addTo(this.map);
    //       this.map.setView([resp.coords.latitude, resp.coords.longitude], 15);
    //     } else {
    //       this.sendToast(
    //         this._translateService.instant("messages.geoOutOfBounds")
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     this.sendToast(this._translateService.instant("messages.genericError"));
    //   });
  }
}

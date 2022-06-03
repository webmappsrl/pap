import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {GeoJson} from '../../features/waste-center-collection/waste-center-collection-model';
import {
  Map,
  map,
  tileLayer,
  marker,
  icon,
  LeafletEvent,
  LatLngExpression,
  LeafletMouseEvent,
  latLng,
  Icon,
} from 'leaflet';

const DEFAULT_CENTER_ZOOM = 12;

const MAP_OPTIONS = {
  MAX_ZOOM: 18,
  MIN_ZOM: 10,
  START_ZOOM: 10,
  START_COORD: [42.7666, 10.28333],
};

@Component({
  selector: 'pap-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit, OnDestroy {
  myPositionMarker!: any;
  map!: Map;
  @Output() markerClickEvt: EventEmitter<GeoJson> = new EventEmitter<GeoJson>();

  @Output() genericClickEvt: EventEmitter<number[]> = new EventEmitter<number[]>();

  @Input() set markers(value: GeoJson[]) {
    this.makeMarkers(value);
  }

  @Input() set positionMarker(value: number[]) {
    if (value) {
      this.makePositionMarker(value);
    }
  }

  @Input() set center(value: number[]) {
    if (value) {
      this.centerToPoint(value);
    }
  }

  clickedMarker(_: LeafletEvent, feature: GeoJson) {
    this.markerClickEvt.emit(feature);
  }

  clickOnMap(ev: LeafletMouseEvent) {
    this.genericClickEvt.emit([ev.latlng.lat, ev.latlng.lng]);
  }

  makeMarkers(features: GeoJson[]): void {
    // TODO remove old markers?

    for (const feature of features) {
      const lon = feature.geometry.coordinates[0];
      const lat = feature.geometry.coordinates[1];
      const myMarker = marker([lat, lon], {icon: this.getIcon('wastecenter')});

      myMarker.on('click', e => this.clickedMarker(e, feature));
      myMarker.addTo(this.map);
    }
  }

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
  }
  ngOnInit(): void {
    this.initMap();
  }

  makePositionMarker(coords: number[]) {
    if (this.myPositionMarker) {
      this.myPositionMarker.remove();
    }

    this.myPositionMarker = marker(latLng(coords[0], coords[1]), {icon: this.getIcon('position')});
    this.myPositionMarker.addTo(this.map);
  }

  getIcon(type: string): Icon {
    let imgUrl = '/assets/icons/pin_poi.png';
    if (type == 'position') {
      imgUrl = '/assets/images/marker-icon-2x.png';
    }

    return icon({
      iconUrl: imgUrl,
      shadowUrl: '/assets/images/marker-shadow.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [-3, -76],
    });
  }

  centerToPoint(coord: number[]) {
    const zoom = this.map.getZoom();
    this.map.setView(latLng(coord[0], coord[1]), Math.max(DEFAULT_CENTER_ZOOM, zoom));
  }

  private initMap(): void {
    this.map = map('map').setView(
      MAP_OPTIONS.START_COORD as LatLngExpression,
      MAP_OPTIONS.START_ZOOM,
    );
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: MAP_OPTIONS.MAX_ZOOM,
      minZoom: MAP_OPTIONS.MIN_ZOM,
    }).addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);

    this.map.on('click', e => this.clickOnMap(e as LeafletMouseEvent));
  }
}

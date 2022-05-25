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
import {Map, map, tileLayer, marker, icon, LeafletEvent, LatLngExpression} from 'leaflet';

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
  map!: Map;
  @Output() markerClickEvt: EventEmitter<GeoJson> = new EventEmitter<GeoJson>();

  @Input() set markers(value: GeoJson[]) {
    this.makeMarkers(value);
  }

  clickedMarker(_: LeafletEvent, feature: GeoJson) {
    this.markerClickEvt.emit(feature);
  }

  makeMarkers(features: GeoJson[]): void {
    // TODO remove old markers?

    const myIcon = icon({
      iconUrl: '/assets/icons/pin_poi.png',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [-3, -76],
    });

    for (const feature of features) {
      const lon = feature.geometry.coordinates[0];
      const lat = feature.geometry.coordinates[1];
      const myMarker = marker([lat, lon], {icon: myIcon});

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
  }
}

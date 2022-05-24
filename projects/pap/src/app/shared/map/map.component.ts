import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  GeoJson,
  WasteCenterCollectionFeature,
} from '../../features/waste-center-collection/waste-center-collection-model';
import {Map, map, tileLayer, marker} from 'leaflet';

@Component({
  selector: 'pap-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements AfterViewInit {
  private map!: Map;

  @Input('markers') set setMarkers(value: GeoJson[]) {
    this.makeMarkers(value);
  }

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = map('map', {
      center: [10.3138628, 42.8112733],
      zoom: 3,
    });
    const tiles = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    tiles.addTo(this.map);
  }

  makeMarkers(features: GeoJson[]): void {
    console.log('------- ~ MapComponent ~ makeMarkers ~ features', features);
    for (const feature of features) {
      const lon = feature.geometry.coordinates[0];
      const lat = feature.geometry.coordinates[1];
      const myMarker = marker([lat, lon]);

      myMarker.addTo(this.map);
    }
  }
}

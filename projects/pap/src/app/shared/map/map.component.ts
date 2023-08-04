import {confiniZone} from './state/map.selectors';
import {environment} from 'projects/pap/src/environments/environment';
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
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
  geoJson,
} from 'leaflet';
import {AppState} from '@capacitor/app';
import {Store} from '@ngrx/store';
import {setMarker} from './state/map.actions';

const DEFAULT_CENTER_ZOOM = 12;

const MAP_OPTIONS = {
  MAX_ZOOM: environment.config.resources.max_zoom ?? 18,
  MIN_ZOM: environment.config.resources.min_zoom ?? 10,
  DEFAULT_ZOOM: environment.config.resources.default_zoom ?? 10,
  LOCATION: environment.config.resources.location ?? [42.7666, 10.28333],
};

@Component({
  selector: 'pap-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit, OnDestroy {
  static index = 0;

  @Input() set center(value: number[]) {
    if (value != null && value.length === 2) {
      this.centerToPoint(value);
    }
  }

  @Input() set markers(value: GeoJson[]) {
    if (this.map == null) {
      this.initMap();
    }
    this.makeMarkers(value);
  }

  @Input() set positionMarker(value: number[]) {
    if (value) {
      this.makePositionMarker(value);
    }
  }

  @Input() set featureCollection(features: any[]) {
    if (features.length > 0) {
      geoJson(features).addTo(this.map);
    }
  }

  @Input() edit = true;
  @Output() genericClickEvt: EventEmitter<number[]> = new EventEmitter<number[]>();
  @Output() markerClickEvt: EventEmitter<GeoJson> = new EventEmitter<GeoJson>();

  map!: Map;
  mapId = `map-${MapComponent.index}`;
  myPositionMarker!: any;

  constructor(
    private _store: Store<AppState>,
    private _renderer: Renderer2,
    private _el: ElementRef,
  ) {
    MapComponent.index += 1;
    setTimeout(() => {
      if (this.map == null) {
        this.initMap();
      }
    }, 500);
  }

  centerToPoint(coord: number[]) {
    if (this.map != null) {
      const zoom = this.map.getZoom();
      this.map.setView(latLng(coord[1], coord[0]), Math.max(DEFAULT_CENTER_ZOOM, zoom));
    }
  }

  clickOnMap(ev: LeafletMouseEvent) {
    const coords: [number, number] = [ev.latlng.lng, ev.latlng.lat];
    this._store.dispatch(setMarker({coords}));
    this.genericClickEvt.emit(coords);
  }

  clickedMarker(_: LeafletEvent, feature: GeoJson) {
    this.markerClickEvt.emit(feature);
  }

  getIcon(type: string): Icon {
    let imgUrl = '/assets/icons/pin_poi.png';
    if (type == 'position') {
      imgUrl = '/assets/images/marker-icon-2x.png';
    }

    return icon({
      iconUrl: imgUrl,
      shadowUrl: '/assets/images/marker-shadow.png',
      iconSize: type == 'position' ? [25, 41] : [40, 40],
      iconAnchor: [12.5, 41],
      popupAnchor: [-3, -76],
    });
  }

  makeMarkers(features: GeoJson[]): void {
    for (const feature of features) {
      const lon = feature.geometry.coordinates[0];
      const lat = feature.geometry.coordinates[1];
      const myMarker = marker([lat, lon], {icon: this.getIcon('wastecenter')});

      myMarker.on('click', e => this.clickedMarker(e, feature));
      myMarker.addTo(this.map);
    }
  }

  makePositionMarker(coords: number[]) {
    if (this.myPositionMarker) {
      this.myPositionMarker.remove();
    }
    if (this.map == null) {
      this.initMap();
    }
    if (this.map != null) {
      this.myPositionMarker = marker(latLng(coords[1], coords[0]), {
        icon: this.getIcon('position'),
      });
      this.myPositionMarker.addTo(this.map);
    }
  }

  ngOnDestroy() {
    this.map.clearAllEventListeners;
    this.map.remove();
  }

  ngOnInit(): void {
    if (this.edit === false) {
      this.map.dragging.disable();
      this.map.scrollWheelZoom.disable();
      this.map.touchZoom.disable();
      this.map.doubleClickZoom.disable();
      this.map.boxZoom.disable();
      this.map.keyboard.disable();
    }
  }

  private initMap(): void {
    const mapDiv = this._renderer.createElement('div');
    this._renderer.setAttribute(mapDiv, 'id', this.mapId);
    this._renderer.setStyle(mapDiv, 'height', '100%');
    this._renderer.appendChild(this._el.nativeElement, mapDiv);
    this.map = map(this.mapId).setView(
      MAP_OPTIONS.LOCATION as LatLngExpression,
      MAP_OPTIONS.DEFAULT_ZOOM,
    );
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: MAP_OPTIONS.MAX_ZOOM,
      minZoom: MAP_OPTIONS.MIN_ZOM,
    }).addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
    }, 400);

    this.map.on('click', e => this.clickOnMap(e as LeafletMouseEvent));
  }
}

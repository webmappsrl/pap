export interface GeoJsonFeatureCollection {
  features: Feature[];
  type:
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
    | 'GeometryCollection'
    | 'Feature'
    | 'FeatureCollection';
}

export interface Feature {
  geometry: Geometry;
  properties: FeatureProperties;
  type: string;
}

export interface FeatureProperties {
  availableUserTypes: UserType[];
  comune: string;
  id: number;
  label: string;
  types: number[];
  url: string;
}

export interface UserType {
  id: number;
  label: {
    it: string;
    en: string;
  };
}

export interface Geometry {
  coordinates: number[][][][];
  type: string;
}

export interface AddressEvent {
  address: string;
  location: [number, number] | number[];
}

export interface Zone {
  geometry: ZoneGeometry;
  properties?: ZoneProperties;
  type: string;
}

export interface ZoneProperties {
  availableUserTypes: UserType[];
  comune: string;
  id: number;
  label?: string;
  types: number[];
  url: string;
}

export interface UserType {
  id: number;
  label: LanguageMap;
}

export interface LanguageMap {
  en: string;
  it: string;
}

export interface ZoneGeometry {
  coordinates: number[][][][];
  type: string;
}

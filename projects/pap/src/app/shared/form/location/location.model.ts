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
  company_id: number;
  created_at: string;
  id: number;
  label: {
    it: string;
    en: string;
  };
  slug: string;
  updated_at: string;
}

export interface Geometry {
  coordinates: number[][][][];
  type: string;
}

export interface AddressEvent {
  address: string;
  city: string;
  house_number?: string;
  location: [number, number] | number[];
}

export interface Zone {
  company_id?: number;
  comune?: string;
  created_at?: string;
  geometry: ZoneGeometry;
  id?: number;
  label?: string;
  properties?: ZoneProperties;
  type: string;
  updated_at?: string;
  url?: string;
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

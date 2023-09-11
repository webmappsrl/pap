export interface WasteCenterCollectionFeature extends GeoJson {
  properties: WasteCenterCollectionFeatureProperties;
}

export interface WasteCenterCollectionFeatureProperties {
  'marker-color': string; //BAD JSON??
  'marker-size': string; //BAD JSON??
  website: string;
  picture_url: string; //BAD JSON??
  name: string;
  orario: string;
  description: string;
  translations: any;
}

export interface GeoJson {
  type: string;
  geometry: Geometry;
  properties: WasteCenterCollectionFeatureProperties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

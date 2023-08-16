import {Pipe, PipeTransform} from '@angular/core';
import Feature from 'ol/Feature';
import MultiPolygon from 'ol/geom/MultiPolygon';
@Pipe({
  name: 'getZoneFromLocation',
})
export class GetZoneFromLocationPipe implements PipeTransform {
  transform(coords: number[], zones: any[]): string {
    if (zones.length > 0 && coords.length > 0) {
      const confiniIn: any[] = zones.filter(c => {
        const ffea = new Feature({
          geometry: new MultiPolygon(c.geometry.coordinates),
        });
        return ffea.getGeometry()!.intersectsCoordinate(coords);
      });

      return confiniIn[0]?.properties.label ?? 'nessuna zona include questa via';
    }
    return 'nessuna zona include questa via';
  }
}

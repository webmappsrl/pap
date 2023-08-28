import {ChangeDetectorRef, Pipe, PipeTransform} from '@angular/core';
import {format as fm} from 'date-fns';
import {it} from 'date-fns/locale';
@Pipe({
  name: 'papReverse',
})
export class PapDatePipe implements PipeTransform {
  transform(values: any[]): any[] {
    return values.reverse();
  }
}

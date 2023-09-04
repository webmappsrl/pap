import {Pipe, PipeTransform} from '@angular/core';
import {format as fm} from 'date-fns';
import {it} from 'date-fns/locale';
@Pipe({
  name: 'papDate',
})
export class PapDatePipe implements PipeTransform {
  transform(value: string, format = 'MMMM'): string {
    return fm(new Date(value), format, {
      locale: it,
    });
  }
}

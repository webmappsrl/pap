import {ChangeDetectorRef, Pipe, PipeTransform} from '@angular/core';
import {format as fm} from 'date-fns';
import {it} from 'date-fns/locale';
@Pipe({
  name: 'papDate',
})
export class PapDatePipe implements PipeTransform {
  transform(value: string, format = 'MMMM'): string {
    const newDate = new Date(value);
    const resDate = fm(newDate, format, {
      locale: it,
    });
    console.log(resDate);
    this._cdr.detectChanges();
    return resDate;
  }
  constructor(private _cdr: ChangeDetectorRef) {}
}

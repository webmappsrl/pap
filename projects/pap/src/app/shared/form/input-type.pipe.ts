import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'inputType',
})
export class InputTypePipe implements PipeTransform {
  transform(value: string): string {
    if (value === 'phone') {
      return 'number';
    }
    return value;
  }
}

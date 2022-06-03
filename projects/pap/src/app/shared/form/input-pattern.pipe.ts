import {Pipe, PipeTransform} from '@angular/core';
const REGEX_NUMBER = /([0-9\s\-]{7,})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
@Pipe({
  name: 'inputPattern',
})
export class InputPatternPipe implements PipeTransform {
  transform(value: string): any {
    if (value === 'phone') {
      return REGEX_NUMBER;
    }
    return value;
  }
}

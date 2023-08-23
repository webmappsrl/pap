import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'papLang',
})
export class PapLangPipe implements PipeTransform {
  transform(value: string | {[lang: string]: string}): string {
    if (typeof value === 'string') {
      return value;
    } else {
      const keys = Object.keys(value);
      return value[keys[0]];
    }
  }
}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(items: any[]): any[] {
    if (!items) return [];
    return items.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}

import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filterBy',
})
export class FilterByPipe implements PipeTransform {
  transform(items: any[], searchString: string): any[] {
    if (!items) return [];
    if (!searchString) return items;
    searchString = searchString.toLocaleLowerCase();
    return items.filter(item => {
      const name = item.name ? item.name.toLocaleLowerCase() : '';
      return name.includes(searchString);
    });
  }
}

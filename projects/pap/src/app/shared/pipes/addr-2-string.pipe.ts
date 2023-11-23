import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'addr2string',
})
export class addr2StringPipe implements PipeTransform {
  transform(address: any | undefined): string {
    let res = '';
    if (address != null) {
      if (address.city) {
        res += address.city;
        if (address.address != null) {
          res += `, ${address.address}`;
        }
        if (address.house_number != null) {
          res += `, ${address.house_number}`;
        }
      }
    }

    return res;
  }
}

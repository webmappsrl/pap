import {Pipe, PipeTransform} from '@angular/core';
import {Calendar} from '../../features/calendar/calendar.model';
import {Address} from '../../core/auth/auth.model';
@Pipe({
  name: 'papAddressesFromCalendars',
})
export class papAddressesFromCalendars implements PipeTransform {
  transform(calendars: Calendar[] | undefined): Address[] {
    if (calendars != null) {
      return calendars.map(c => c.address);
    }
    return [];
  }
}

import {Pipe, PipeTransform} from '@angular/core';
@Pipe({
  name: 'papTicket',
})
export class PapTicketPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'abandonment': {
        return 'abbandono';
      }
      case 'reservation': {
        return 'prenotazione';
      }
      case 'report': {
        return 'mancato ritiro';
      }
      case 'info': {
        return 'informazioni';
      }
      default: {
        return value;
      }
    }
  }
}

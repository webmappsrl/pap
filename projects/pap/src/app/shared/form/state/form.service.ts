import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment as env} from 'projects/pap/src/environments/environment';
import {Observable} from 'rxjs';
import {Ticket} from '../model';
const company_id = 4;
@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private _http: HttpClient) {}

  sendTicket(ticket: Ticket): Observable<any> {
    return this._http.post(`${env.api}/c/${company_id}/ticket`, ticket);
  }
}
